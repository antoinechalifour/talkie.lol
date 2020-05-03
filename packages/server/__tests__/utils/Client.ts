import { gql } from "apollo-server-koa";
import ws from "ws";
import {
  Client as UrqlClient,
  createRequest,
  defaultExchanges,
  subscriptionExchange,
} from "@urql/core";
import { SubscriptionClient } from "subscriptions-transport-ws";
import fetch from "node-fetch";

export interface GraphQLSpace {
  id: string;
  slug: string;
}

export interface GraphQLUser {
  id: string;
  name: string;
}

export interface GraphQLSession {
  token: string;
  user: GraphQLUser;
  space: GraphQLSpace;
}

export interface GraphQLRtcConfiguration {
  iceServers: Array<{ urls: string[] }>;
}

const CREATE_SPACE_MUTATION = gql`
  mutation CreateSpace {
    createSpace {
      success
      space {
        id
        slug
      }
    }
  }
`;

interface CreateSpaceMutationResult {
  createSpace: {
    success: boolean;
    space: GraphQLSpace;
  };
}

const LOGIN_MUTATION = gql`
  mutation Login($slug: String!, $userName: String) {
    login(args: { slug: $slug, userName: $userName }) {
      success
      session {
        token
        user {
          id
          name
        }
        space {
          id
          slug
        }
      }
      rtcConfiguration {
        iceServers {
          urls
        }
      }
    }
  }
`;

interface LoginMutationVariables {
  slug: string;
  userName: string | null;
}

interface LoginMutationResult {
  login: {
    success: boolean;
    session: GraphQLSession;
    rtcConfiguration: GraphQLRtcConfiguration;
  };
}

const JOIN_SPACE_MUTATION = gql`
  mutation JoinSpace {
    joinSpace {
      success
    }
  }
`;

interface JoinSpaceMutationResult {
  joinSpace: {
    success: boolean;
  };
}

const SPACE_JOINED_SUBSCRIPTION = gql`
  subscription SpaceJoined($slug: String!) {
    spaceJoined(args: { slug: $slug }) {
      space {
        id
        slug
      }
      user {
        id
        name
      }
    }
  }
`;

const makeUrl = (port: string) => `http://localhost:${port}/graphql`;

export class Client {
  private constructor(
    private urlqClient: UrqlClient,
    private subscriptionClient: SubscriptionClient | null,
    private isAuthenticated: boolean
  ) {}

  createSpace() {
    return this.urlqClient
      .mutation<CreateSpaceMutationResult>(CREATE_SPACE_MUTATION)
      .toPromise();
  }

  login(slug: string, userName: string) {
    return this.urlqClient
      .mutation<LoginMutationResult, LoginMutationVariables>(LOGIN_MUTATION, {
        slug,
        userName,
      })
      .toPromise();
  }

  joinSpace() {
    if (!this.isAuthenticated)
      throw new Error("Must use an authenticated client");

    return this.urlqClient
      .mutation<JoinSpaceMutationResult>(JOIN_SPACE_MUTATION)
      .toPromise();
  }

  onSpaceJoined(slug: string) {
    if (!this.isAuthenticated)
      throw new Error("Must use an authenticated client");

    const query = createRequest(SPACE_JOINED_SUBSCRIPTION, { slug });

    return this.urlqClient.executeSubscription(query);
  }

  close() {
    if (!this.subscriptionClient) return;

    this.subscriptionClient.close();
  }

  static createAnonymousClient(port: string) {
    return new Client(
      new UrqlClient({
        url: makeUrl(port),
        fetch: fetch as any,
      }),
      null,
      false
    );
  }

  static createAuthenticatedClient(
    port: string,
    token: string
  ): Promise<Client> {
    const url = makeUrl(port);

    return new Promise((resolve) => {
      // eslint-disable-next-line prefer-const
      let client: Client;

      const subscriptionClient = new SubscriptionClient(
        url,
        {
          reconnect: true,
          connectionParams: { authToken: token },
          connectionCallback: () => resolve(client),
        },
        ws
      );

      client = new Client(
        new UrqlClient({
          url,
          fetch: fetch as any,
          fetchOptions: {
            headers: { authorization: token },
          },
          exchanges: [
            ...defaultExchanges,
            subscriptionExchange({
              forwardSubscription(operation) {
                return subscriptionClient.request(operation);
              },
            }),
          ],
        }),
        subscriptionClient,
        true
      );
    });
  }
}
