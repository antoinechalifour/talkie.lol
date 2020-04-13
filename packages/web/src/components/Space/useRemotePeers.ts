import { useEffect, useState } from "react";

import { ConferenceViewModel } from "./viewmodels/ConferenceViewModel";

export const useRemotePeers = (conference: ConferenceViewModel) => {
  const [{ value }, setRemotePeers] = useState(() => ({
    value: conference.allRemotePeers(),
  }));

  useEffect(
    () => conference.onRemotePeersChanged((value) => setRemotePeers({ value })),
    [conference]
  );

  return value;
};
