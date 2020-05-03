import { gql } from "apollo-server-koa";
import { Client as UrqlClient } from "@urql/core";
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

export class Client {
  private client: UrqlClient;

  constructor(port: string) {
    const url = `http://localhost:${port}/graphql`;

    this.client = new UrqlClient({
      url,
      fetch: fetch as any,
    });
  }

  createSpace() {
    return this.client
      .mutation<CreateSpaceMutationResult>(CREATE_SPACE_MUTATION)
      .toPromise();
  }

  login(slug: string, userName: string) {
    return this.client
      .mutation<LoginMutationResult, LoginMutationVariables>(LOGIN_MUTATION, {
        slug,
        userName,
      })
      .toPromise();
  }
}
