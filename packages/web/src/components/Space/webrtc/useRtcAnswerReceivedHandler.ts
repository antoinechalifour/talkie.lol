import { PeerConnections } from "./types";
import { logSignaling } from "./log";

interface UseRtcAnswerReceivedHandlerOptions {
  peerConnections: PeerConnections;
}

export const useRtcAnswerReceivedHandler = ({
  peerConnections,
}: UseRtcAnswerReceivedHandlerOptions) => {
  return async (senderId: string, answer: RTCSessionDescriptionInit) => {
    logSignaling(`📪 Received an answer from remote user ${senderId}`);

    const remotePeer = peerConnections.get(senderId);

    if (!remotePeer) {
      return;
    }

    await remotePeer.setRemoteDescription(answer);
  };
};
