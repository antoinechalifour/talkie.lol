import { Server } from "http";
import debug from "debug";
import cors from "@koa/cors";
import Koa, { Context } from "koa";
import { ApolloServer } from "apollo-server-koa";
import { asValue, AwilixContainer } from "awilix";

import { Token } from "../domain/entities/Token";
import { User } from "../domain/entities/User";
import { UserPort } from "../usecase/ports/UserPort";
import { TokenPort } from "../usecase/ports/TokenPort";
import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";
import { GraphQLContext } from "./types";

export interface AppOptions {
  port: string;
  container: AwilixContainer;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SubscriptionConnection = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SubscriptionParams = any;

interface ContextFactoryOptions {
  ctx: Context;
  connection: SubscriptionConnection;
}

const log = debug("app:server");

export class TalkieApp {
  private readonly koa: Koa;
  private readonly container: AwilixContainer;
  private server?: Server;

  constructor(private options: AppOptions) {
    this.koa = new Koa();
    this.container = options.container;

    this.koa.use(cors());
  }

  run(): Promise<void> {
    return new Promise((resolve) => {
      log(`Starting server on port ${this.options.port}`);
      this.server = this.koa.listen(this.options.port, resolve);
      const apollo = this.getGraphQLServer();

      apollo.applyMiddleware({ app: this.koa });
      apollo.installSubscriptionHandlers(this.server);
    });
  }

  stop(): Promise<void> {
    const server = this.server;

    if (!server) return Promise.resolve();

    return new Promise((resolve) => server.close(() => resolve()));
  }

  private getGraphQLServer(): ApolloServer {
    return new ApolloServer({
      typeDefs,
      resolvers,
      context: this.getGraphQLContext,
      subscriptions: {
        onConnect: this.onSubscriptionConnect,
      },
      formatError: (e): never => {
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

  private onSubscriptionConnect = async (
    params: SubscriptionParams
  ): Promise<{ currentUser: User }> => {
    log("Handling subscription connection");

    if (!params.authToken) {
      throw new Error("User must be authenticated");
    }

    const currentUser = await this.getAuthenticatedUser(params.authToken);

    return { currentUser };
  };

  private getScopedContainer(): AwilixContainer {
    return this.container.createScope();
  }

  private getSubscriptionContext(
    connection: SubscriptionConnection
  ): GraphQLContext {
    log("Creating GraphQL context for subscription");

    const container = this.getScopedContainer();

    container.register("currentUser", asValue(connection.context.currentUser));

    return { container };
  }

  private async getDefaultContext(ctx: Context): Promise<GraphQLContext> {
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
  ): Promise<void> {
    const currentUser = await this.getAuthenticatedUser(authorizationHeader);

    log(`Setting current user to ${currentUser.id.get()}`);
    container.register("currentUser", asValue(currentUser));
  }

  private async getAuthenticatedUser(
    authorizationHeader: string
  ): Promise<User> {
    const tokenPort = this.container.resolve<TokenPort<Token>>("tokenPort");
    const userPort = this.container.resolve<UserPort>("userPort");

    const token = await tokenPort.decode(authorizationHeader);

    return userPort.findUserById(token.userId);
  }
}
