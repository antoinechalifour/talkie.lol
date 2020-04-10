import { RemotePeer } from "./RemotePeer";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

interface UseNotifierOptions {
  remotePeers: RemotePeer[];
}

export const useNotifier = ({ remotePeers }: UseNotifierOptions) => {
  const peersRef = useRef<Map<string, RemotePeer>>(new Map());

  useEffect(() => {
    for (const remotePeer of remotePeers) {
      const id = remotePeer.id();

      if (peersRef.current.get(id)) {
        continue;
      }

      toast.success(`User ${remotePeer.name()} joined.`);

      remotePeer.onDisconnected(() => {
        toast(`User ${remotePeer.name()} left.`);
        peersRef.current.delete(remotePeer.id());
      });
    }
  }, [remotePeers]);
};
