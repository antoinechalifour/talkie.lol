import { importSchema } from "graphql-import";

export const typeDefs = importSchema("**/*.graphql");
