import { useEffect, useState } from "react";

import { useConference } from "./useConference";

export const useRemotePeers = () => {
  const conference = useConference();
  const [remotePeers, setRemotePeers] = useState(conference.allRemotePeers());

  useEffect(() => {
    const observer = conference.observePeersChanged();

    (async function () {
      for await (const peers of observer) {
        setRemotePeers([...peers]);
      }
    })();

    return observer.cancel;
  }, [conference]);

  return remotePeers;
};
