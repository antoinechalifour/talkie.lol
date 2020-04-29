export type ConnectionType = "unknown" | "offline" | "slow" | "medium" | "fast";

export const getConnectionType = (effectiveType: string | undefined) => {
  switch (effectiveType) {
    case "slow-2g":
    case "2g":
      return "slow";

    case "3g":
      return "medium";

    case "4g":
      return "fast";

    default:
      return "unknown";
  }
};

export const getLabelForConnectionType = (connectionType: ConnectionType) => {
  switch (connectionType) {
    case "fast":
      return "Your connection is fast";

    case "medium":
      return "Your connection is slow";

    case "slow":
      return "Your connection is unstable";

    case "offline":
      return "You're offline";
  }
};
