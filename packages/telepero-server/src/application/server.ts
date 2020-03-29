import debug from "debug";
import util from 'util'
import Koa, { Context } from "koa";
import { ApolloServer } from "apollo-server-koa";

import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";
import { asValue, AwilixContainer } from "awilix";
import { GraphQLContext } from "./types";
import { UserPort } from "../usecase/ports/UserPort";
import { TokenPort } from "../usecase/ports/TokenPort";
import { Token } from "../domain/entities/Token";

export interface AppOptions {
  port: string;
  container: AwilixContainer;
}

interface ContextFactoryOptions {
  ctx: Context;
  connection: any;
}

const log = debug("app:server");

export class TeleperoApp {
  private koa: Koa;
  private container: AwilixContainer;

  constructor(private options: AppOptions) {
    this.koa = new Koa();
    this.container = options.container;
  }

  run() {
    return new Promise((resolve) => {
      log(`Starting server on port ${this.options.port}`);
      const server = this.koa.listen(this.options.port, resolve);
      const apollo = this.getGraphQLServer();

      apollo.applyMiddleware({ app: this.koa });
      apollo.installSubscriptionHandlers(server);
    });
  }

  private getGraphQLServer() {
    return new ApolloServer({
      typeDefs,
      resolvers,
      context: this.getGraphQLContext,
      subscriptions: {
        onConnect: this.onSubscriptionConnect,
        onDisconnect: this.onSubscriptionDisconnect,
      },
      formatError: (e) => {
        console.error(e.originalError);

        throw e;
      },
    });
  }

  private getGraphQLContext = async ({
    ctx,
    connection,
  }: ContextFactoryOptions): Promise<GraphQLContext> => {
    if (connection) {
      return this.getSubscriptionContext(connection);
    } else {
      return this.getDefaultContext(ctx);
    }
  };

  private onSubscriptionConnect = async (params: any) => {
    log("Handling subscription connection");

    if (!params.authToken) {
      throw new Error("User must be authenticated");
    }

    const currentUser = await this.getAuthenticatedUser(params.authToken);

    return { currentUser };
  };

  private onSubscriptionDisconnect = () => {
    log("Handling subscription disconnection");
    // TODO: clear the app
  };

  private getScopedContainer() {
    return this.container.createScope();
  }

  private getSubscriptionContext(connection: any) {
    log("Creating GraphQL context for subscription");

    const container = this.getScopedContainer();

    container.register("currentUser", asValue(connection.context.currentUser));

    return { container };
  }

  private async getDefaultContext(ctx: Context) {
    log("Creating GraphQL context");
    const container = this.getScopedContainer();
    const authorizationHeader = ctx.header.authorization;

    if (authorizationHeader) {
      log(`Creating authenticated context ${authorizationHeader}`);
      await this.setAuthenticatedUser(authorizationHeader, container);
    } else {
      container.register("currentUser", asValue(null));
    }

    return { container };
  }

  private async setAuthenticatedUser(
    authorizationHeader: string,
    container: AwilixContainer
  ) {
    const currentUser = await this.getAuthenticatedUser(authorizationHeader);

    log(`Setting current user to ${currentUser.id.get()}`);
    container.register("currentUser", asValue(currentUser));
  }

  private async getAuthenticatedUser(authorizationHeader: string) {
    const tokenPort = this.container.resolve<TokenPort<Token>>("tokenPort");
    const userPort = this.container.resolve<UserPort>("userPort");

    const token = await tokenPort.decode(authorizationHeader);

    return userPort.findUserById(token.userId);
  }
}
