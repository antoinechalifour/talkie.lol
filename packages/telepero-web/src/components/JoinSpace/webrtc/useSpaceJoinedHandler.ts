import { useMutation } from "urql";
import {OnConnectedEvent, OnDisconnectedEvent, PeerConnections} from "./types";
import {
  SEND_RTC_ICE_CANDIDATE,
  SEND_RTC_OFFER,
  SendRtcIceCandidateVariables,
  SendRtcOfferVariables,
} from "./signaling";
import { logMedia, logRtc, logSignaling } from "./log";
import {
  createPeerConnection,
  onIceCandidate,
  onNegotiationNeeded,
  onPeerConnectionConnected,
  onPeerConnectionDisconnected,
} from "./peerConnection";
import { createMediaStreamForPeerConnection } from "./mediaStream";

interface UseSpaceJoinedHandlerOptions {
  userMedia: MediaStream | null;
  peerConnections: PeerConnections;
  onConnected: (e: OnConnectedEvent) => void;
  onDisconnected: (e: OnDisconnectedEvent) => void;
}

export const useSpaceJoinedHandler = ({
  userMedia,
  peerConnections,
  onConnected,
  onDisconnected,
}: UseSpaceJoinedHandlerOptions) => {
  const [, sendRtcOffer] = useMutation<unknown, SendRtcOfferVariables>(
    SEND_RTC_OFFER
  );
  const [, sendRtcIceCandidate] = useMutation<
    unknown,
    SendRtcIceCandidateVariables
  >(SEND_RTC_ICE_CANDIDATE);

  return async (userId: string) => {
    logSignaling(`📫 User ${userId} joined the space`);

    // Create the connection
    logRtc(`🏗 Creating a peer connection for remote user ${userId}`);
    const peerConnection = createPeerConnection();
    peerConnections.set(userId, peerConnection);

    // Create the media stream
    const mediaStream = createMediaStreamForPeerConnection(peerConnection);

    // Send ice candidate as they arrive
    onIceCandidate(peerConnection, (candidate) => {
      logSignaling(`🛫 Sending an ice candidate to remote user ${userId}`);

      sendRtcIceCandidate({
        candidate: candidate.candidate,
        sdpMid: candidate.sdpMid!,
        sdpMLineIndex: candidate.sdpMLineIndex!,
        recipientId: userId,
      });
    });

    onNegotiationNeeded(peerConnection, (offer) => {
      logSignaling(`🛫 Sending an offer to remote user (as offerer) ${userId}`);

      sendRtcOffer({
        offer: offer.sdp!,
        recipientId: userId,
      });
    });

    onPeerConnectionConnected(peerConnection, () => {
      logRtc(`✅ Connection established with remote user ${userId}`);

      onConnected({
        userId,
        mediaStream,
      });
    });

    onPeerConnectionDisconnected(peerConnection, () => {
      logRtc(`❌ Connection closed with remote user ${userId}`);

      onDisconnected({ userId });
    });

    // Create an offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    if (userMedia) {
      userMedia.getTracks().forEach((track) => {
        logMedia(`🏗 Adding a remote track for user ${userId}`);
        peerConnection.addTrack(track, userMedia);
      });
    }

    // Send the offer
    logSignaling(`🛫 Sending an offer to remote user ${userId}`);

    await sendRtcOffer({
      offer: offer.sdp!,
      recipientId: userId,
    });
  };
};
