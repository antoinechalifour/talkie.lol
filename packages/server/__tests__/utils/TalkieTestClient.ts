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

const LEAVE_SPACE_MUTATION = gql`
  mutation LeaveSpace {
    leaveSpace {
      success
    }
  }
`;

interface LeaveSpaceMutationResult {
  leaveSpace: {
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

const SPACE_LEFT_SUBSCRIPTION = gql`
  subscription SpaceLeft($slug: String!) {
    spaceLeft(args: { slug: $slug }) {
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

const SEND_RTC_OFFER_MUTATION = gql`
  mutation SendRtcOffer($recipientId: String!, $offer: String!) {
    sendRtcOffer(args: { recipientId: $recipientId, offer: $offer }) {
      success
    }
  }
`;

interface SendRtcOfferMutationResult {
  sendRtcOffer: {
    success: boolean;
  };
}

interface SendRtcOfferMutationVariables {
  recipientId: string;
  offer: string;
}

const RTC_OFFER_RECEIVED_SUBSCRIPTION = gql`
  subscription RtcOfferReceived {
    offerReceived {
      offer {
        sdp
        type
      }
      sender {
        id
        name
      }
    }
  }
`;

const SEND_RTC_ANSWER_MUTATION = gql`
  mutation SendRtcAnswer($answer: String!, $recipientId: String!) {
    sendRtcAnswer(args: { answer: $answer, recipientId: $recipientId }) {
      success
    }
  }
`;

interface SendRtcAnswerMutationResult {
  sendRtcAnswer: {
    success: boolean;
  };
}

interface SendRtcAnswerMutationVariables {
  recipientId: string;
  answer: string;
}

const RTC_ANSWER_RECEIVED_SUBSCRIPTION = gql`
  subscription RtcAnswerReceived {
    answerReceived {
      answer {
        sdp
        type
      }
      sender {
        id
        name
      }
    }
  }
`;

const makeUrl = (port: string) => `http://localhost:${port}/graphql`;

export class TalkieTestClient {
  private constructor(
    private urqlClient: UrqlClient,
    private subscriptionClient: SubscriptionClient | null,
    private isAuthenticated: boolean
  ) {}

  createSpace() {
    return this.urqlClient
      .mutation<CreateSpaceMutationResult>(CREATE_SPACE_MUTATION)
      .toPromise();
  }

  login(slug: string, userName: string) {
    return this.urqlClient
      .mutation<LoginMutationResult, LoginMutationVariables>(LOGIN_MUTATION, {
        slug,
        userName,
      })
      .toPromise();
  }

  joinSpace() {
    this.requireAuthentication();

    return this.urqlClient
      .mutation<JoinSpaceMutationResult>(JOIN_SPACE_MUTATION)
      .toPromise();
  }

  leaveSpace() {
    this.requireAuthentication();

    return this.urqlClient
      .mutation<LeaveSpaceMutationResult>(LEAVE_SPACE_MUTATION)
      .toPromise();
  }

  sendRtcOffer(recipientId: string, offer: string) {
    this.requireAuthentication();

    return this.urqlClient
      .mutation<SendRtcOfferMutationResult, SendRtcOfferMutationVariables>(
        SEND_RTC_OFFER_MUTATION,
        {
          recipientId,
          offer,
        }
      )
      .toPromise();
  }

  sendRtcAnswer(recipientId: string, answer: string) {
    this.requireAuthentication();

    return this.urqlClient
      .mutation<SendRtcAnswerMutationResult, SendRtcAnswerMutationVariables>(
        SEND_RTC_ANSWER_MUTATION,
        { recipientId, answer }
      )
      .toPromise();
  }

  onSpaceJoined(slug: string) {
    this.requireAuthentication();

    const query = createRequest(SPACE_JOINED_SUBSCRIPTION, { slug });

    return this.urqlClient.executeSubscription(query);
  }

  onSpaceLeft(slug: string) {
    this.requireAuthentication();

    const query = createRequest(SPACE_LEFT_SUBSCRIPTION, { slug });

    return this.urqlClient.executeSubscription(query);
  }

  onRtcOfferReceived() {
    this.requireAuthentication();

    const query = createRequest(RTC_OFFER_RECEIVED_SUBSCRIPTION);

    return this.urqlClient.executeSubscription(query);
  }

  onRtcAnswerReceived() {
    this.requireAuthentication();

    const query = createRequest(RTC_ANSWER_RECEIVED_SUBSCRIPTION);

    return this.urqlClient.executeSubscription(query);
  }

  close() {
    if (!this.subscriptionClient) return;

    this.subscriptionClient.close();
  }

  static createAnonymousClient(port: string) {
    return new TalkieTestClient(
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
  ): Promise<TalkieTestClient> {
    const url = makeUrl(port);

    return new Promise((resolve) => {
      // eslint-disable-next-line prefer-const
      let client: TalkieTestClient;

      const subscriptionClient = new SubscriptionClient(
        url,
        {
          reconnect: true,
          connectionParams: { authToken: token },
          connectionCallback: () => resolve(client),
        },
        ws
      );

      client = new TalkieTestClient(
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

  private requireAuthentication() {
    if (!this.isAuthenticated)
      throw new Error("Must use an authenticated client");
  }
}
