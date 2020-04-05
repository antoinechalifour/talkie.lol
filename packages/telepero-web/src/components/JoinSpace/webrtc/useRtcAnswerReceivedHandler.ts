import { PeerConnections } from "./types";
import { logRtc, logSignaling } from "./log";

interface UseRtcAnswerReceivedHandlerOptions {
  peerConnections: PeerConnections;
}

export const useRtcAnswerReceivedHandler = ({
  peerConnections,
}: UseRtcAnswerReceivedHandlerOptions) => {
  return async (senderId: string, answer: RTCSessionDescriptionInit) => {
    logSignaling(`📪 Received an answer from remote user ${senderId}`);

    // Get the connection
    const peerConnection = peerConnections.get(senderId);

    if (!peerConnection) {
      return;
    }

    // Set the remote description
    logRtc(`🏗 Setting the remote description for remote user ${senderId}`);
    await peerConnection.setRemoteDescription(answer);
  };
};
