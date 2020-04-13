import { useCallback, useState } from "react";

import { RemotePeer } from "../../../models/RemotePeer";

export const useLayoutManager = () => {
  const [presenterPeer, setPresenterPeer] = useState<RemotePeer | null>(null);

  const removePresenterPeer = useCallback(() => setPresenterPeer(null), []);

  return { presenterPeer, setPresenterPeer, removePresenterPeer };
};
