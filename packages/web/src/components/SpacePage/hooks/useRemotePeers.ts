import { useEffect, useState } from "react";

import { useConference } from "./useConference";

export const useRemotePeers = () => {
  const conference = useConference();
  const [{ value }, setRemotePeers] = useState(() => ({
    value: conference.allRemotePeers(),
  }));

  useEffect(
    () => conference.onRemotePeersChanged((value) => setRemotePeers({ value })),
    [conference]
  );

  return value;
};
