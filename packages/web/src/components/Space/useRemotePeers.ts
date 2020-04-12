import { useEffect, useState } from "react";

import { Conference } from "./models/Conference";

export const useRemotePeers = (conference: Conference) => {
  const [{ value }, setRemotePeers] = useState(() => ({
    value: conference.allRemotePeers(),
  }));

  useEffect(
    () => conference.onRemotePeersChanged((value) => setRemotePeers({ value })),
    [conference]
  );

  return value;
};
