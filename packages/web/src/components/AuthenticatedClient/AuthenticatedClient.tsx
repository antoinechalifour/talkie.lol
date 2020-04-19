import React from "react";
import { Provider } from "urql";

import { useAuthenticatedClient } from "./useAuthenticatedClient";

interface AuthenticatedClientProps {
  token: string;
}

export const AuthenticatedClient: React.FC<AuthenticatedClientProps> = ({
  children,
  token,
}) => {
  const { isConnected, client } = useAuthenticatedClient({ token });

  if (!isConnected) {
    return null;
  }

  return <Provider value={client}>{children}</Provider>;
};
