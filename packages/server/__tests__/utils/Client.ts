import { gql } from "apollo-server-koa";
import { Client as UrqlClient } from "@urql/core";
import fetch from "node-fetch";

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
    space: {
      id: string;
      slug: string;
    };
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
}
