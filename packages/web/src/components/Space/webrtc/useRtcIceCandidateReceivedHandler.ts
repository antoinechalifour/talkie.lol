import { PeerConnections } from "./types";
import { logSignaling } from "./log";

interface UseRtcIceCandidateReceivedHandler {
  peerConnections: PeerConnections;
}

export const useRtcIceCandidateReceivedHandler = ({
  peerConnections,
}: UseRtcIceCandidateReceivedHandler) => {
  return async (senderId: string, iceCandidate: RTCIceCandidateInit) => {
    logSignaling(`📫 Received an ice candidate for remote user ${senderId}`);

    const remotePeer = peerConnections.get(senderId);

    if (!remotePeer) {
      return;
    }

    await remotePeer.addIceCandidate(iceCandidate);
  };
};
