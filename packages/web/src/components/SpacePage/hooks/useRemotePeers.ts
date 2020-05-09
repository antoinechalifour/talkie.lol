import { useEffect, useState } from "react";

import { useConference } from "./useConference";

export const useRemotePeers = () => {
  const conference = useConference();
  const [remotePeers, setRemotePeers] = useState(conference.allRemotePeers());

  useEffect(() => {
    const observable = conference.observePeersChanged();

    observable.subscribe((peers) => setRemotePeers([...peers]));

    return observable.cancel;
  }, [conference]);

  return remotePeers;
};
