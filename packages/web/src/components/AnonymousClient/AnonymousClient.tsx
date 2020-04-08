import React from "react";
import { Client, Provider } from "urql";

const client = new Client({
  url: process.env.REACT_APP_GRAPHQL_URL!,
});

export const AnonymousClient: React.FC = ({ children }) => {
  return <Provider value={client}>{children}</Provider>;
};
