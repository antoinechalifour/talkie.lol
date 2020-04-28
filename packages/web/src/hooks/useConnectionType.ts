import { useEffect, useState } from "react";
import { ConnectionType, getConnectionType } from "../utils/connectionType";

export const useConnectionType = () => {
  const [connectionType, setConnectionType] = useState<ConnectionType>(
    // @ts-ignore
    getConnectionType(navigator.connection.effectiveType)
  );

  useEffect(() => {
    function onConnectionTypeChange() {
      // @ts-ignore
      setConnectionType(getConnectionType(navigator.connection.effectiveType));
    }

    function setOffline() {
      setConnectionType("offline");
    }

    // @ts-ignore
    navigator.connection.addEventListener("change", onConnectionTypeChange);
    window.addEventListener("online", onConnectionTypeChange);
    window.addEventListener("offline", setOffline);

    return () => {
      // @ts-ignore
      navigator.connection.removeEventListener(
        "change",
        onConnectionTypeChange
      );
      window.removeEventListener("online", onConnectionTypeChange);
      window.removeEventListener("offline", setOffline);
    };
  }, []);

  return { connectionType };
};
