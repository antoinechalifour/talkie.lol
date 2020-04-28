export type ConnectionType = "offline" | "slow" | "medium" | "fast";

export const getConnectionType = (effectiveType: string) => {
  switch (effectiveType) {
    case "slow-2g":
    case "2g":
      return "slow";

    case "3g":
      return "medium";

    default:
      return "fast";
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
