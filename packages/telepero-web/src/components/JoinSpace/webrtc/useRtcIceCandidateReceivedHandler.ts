import { PeerConnections } from "./types";
import { logRtc, logSignaling } from "./log";

interface UseRtcIceCandidateReceivedHandler {
  peerConnections: PeerConnections;
}

export const useRtcIceCandidateReceivedHandler = ({
  peerConnections,
}: UseRtcIceCandidateReceivedHandler) => {
  return async (senderId: string, iceCandidate: RTCIceCandidateInit) => {
    logSignaling(`📫 Received an ice candidate for remote user ${senderId}`);

    // Get the connection
    const peerConnection = peerConnections.get(senderId);

    if (!peerConnection) {
      return;
    }

    // Set the ice candidate
    logRtc(`🏗 Setting an ice candidate for remote user ${senderId}`);
    const candidate = new RTCIceCandidate(iceCandidate);
    await peerConnection.addIceCandidate(candidate);
  };
};
