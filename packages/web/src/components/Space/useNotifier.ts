import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

// @ts-ignore
import notificationSound from "./assets/notification.mp3";
import { RemotePeer } from "./RemotePeer";

interface UseNotifierOptions {
  remotePeers: RemotePeer[];
}

const audio = document.createElement("audio");
audio.src = notificationSound;

export const useNotifier = ({ remotePeers }: UseNotifierOptions) => {
  const peersRef = useRef<Map<string, RemotePeer>>(new Map());

  useEffect(() => {
    for (const remotePeer of remotePeers) {
      const id = remotePeer.id();

      if (peersRef.current.get(id)) {
        continue;
      }

      toast.success(`User ${remotePeer.name()} joined.`);
      audio.play();

      remotePeer.onDisconnected(() => {
        toast(`User ${remotePeer.name()} left.`);
        peersRef.current.delete(remotePeer.id());
      });
    }
  }, [remotePeers]);
};
