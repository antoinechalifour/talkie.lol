import React, { useMemo, useState } from "react";
import { Client, Provider, defaultExchanges, subscriptionExchange } from "urql";
import { SubscriptionClient } from "subscriptions-transport-ws";

interface AuthenticatedClientProps {
  token: string;
}

export const AuthenticatedClient: React.FC<AuthenticatedClientProps> = ({
  children,
  token,
}) => {
  const [isConnected, setConnected] = useState(false);
  const client = useMemo(() => {
    const subscriptionClient = new SubscriptionClient(
      process.env.REACT_APP_SUBSCRIPTION_URL!,
      {
        reconnect: true,
        connectionParams: { authToken: token },
        connectionCallback: (err) => {
          if (!err) {
            setConnected(true);
          }
        },
      }
    );

    return new Client({
      url: process.env.REACT_APP_GRAPHQL_URL!,
      fetchOptions: () => ({
        headers: { authorization: token ?? "" },
      }),
      exchanges: [
        ...defaultExchanges,
        subscriptionExchange({
          forwardSubscription(operation) {
            return subscriptionClient.request(operation);
          },
        }),
      ],
    });
  }, [token]);

  if (!isConnected) {
    return <p>Connecting...</p>;
  }

  return <Provider value={client}>{children}</Provider>;
};
