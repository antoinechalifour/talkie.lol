import { useEffect } from "react";

import { RemotePeer } from "../RemotePeer";
import { logMedia } from "./log";

interface UseMediaOptions {
  localMediaStream: MediaStream | null;
  remotePeers: RemotePeer[];
}

export const useMedia = ({
  localMediaStream,
  remotePeers,
}: UseMediaOptions) => {
  useEffect(() => {
    if (localMediaStream) {
      // TODO: what if this connection already has the stream
      logMedia("🎦 Local media stream added");
      remotePeers.forEach((peer) => peer.sendLocalStream(localMediaStream));
    } else {
      logMedia("🎦 Local media stream removed");
      remotePeers.forEach((peer) => peer.removeLocalStream());
    }
  }, [localMediaStream, remotePeers]);
};
