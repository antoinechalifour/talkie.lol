import { useCallback, useState } from "react";

import { RemotePeer } from "../../../models/RemotePeer";

export const useLayoutManager = () => {
  const [focusedPeer, setFocusedPeer] = useState<RemotePeer | null>(null);

  const removeFocusedPeer = useCallback(() => setFocusedPeer(null), []);

  return { focusedPeer, setFocusedPeer, removeFocusedPeer };
};
