import { useEffect, useState } from "react";

import { useConference } from "./useConference";

export const useRemotePeers = () => {
  const conference = useConference();
  const [remotePeers, setRemotePeers] = useState(conference.allRemotePeers());

  useEffect(
    () =>
      conference
        .observePeersChanged()
        .subscribe((peers) => setRemotePeers([...peers])),
    [conference]
  );

  return remotePeers;
};
