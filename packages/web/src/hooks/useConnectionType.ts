import { useEffect, useState } from "react";

import { ConnectionType, getConnectionType } from "../utils/connectionType";

export const useConnectionType = () => {
  const [connectionType, setConnectionType] = useState<ConnectionType>(
    getConnectionType(navigator.connection?.effectiveType)
  );

  useEffect(() => {
    const connection = navigator.connection;

    if (!connection) return;

    function onConnectionTypeChange() {
      setConnectionType(getConnectionType(connection?.effectiveType));
    }

    function setOffline() {
      setConnectionType("offline");
    }

    connection.addEventListener("change", onConnectionTypeChange);
    window.addEventListener("online", onConnectionTypeChange);
    window.addEventListener("offline", setOffline);

    return () => {
      connection.removeEventListener("change", onConnectionTypeChange);
      window.removeEventListener("online", onConnectionTypeChange);
      window.removeEventListener("offline", setOffline);
    };
  }, []);

  return { connectionType };
};
