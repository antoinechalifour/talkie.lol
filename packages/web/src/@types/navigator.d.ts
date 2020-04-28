interface NavigatorConnection extends EventTarget {
  effectiveType: "slow-2g" | "2g" | "3g" | "4g";
}

interface Navigator {
  connection: NavigatorConnection;
}
