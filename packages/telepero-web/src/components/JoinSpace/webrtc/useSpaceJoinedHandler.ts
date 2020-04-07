import { useMutation } from "urql";
import {OnConnectedEvent, OnDisconnectedEvent, PeerConnections, User} from "./types";
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

  return async (user: User) => {
    logSignaling(`📫 User ${user.id} joined the space`);

    // Create the connection
    logRtc(`🏗 Creating a peer connection for remote user ${user.id}`);
    const peerConnection = createPeerConnection();
    peerConnections.set(user.id, peerConnection);

    // Create the media stream
    const mediaStream = createMediaStreamForPeerConnection(peerConnection);

    // Send ice candidate as they arrive
    onIceCandidate(peerConnection, (candidate) => {
      logSignaling(`🛫 Sending an ice candidate to remote user ${user.id}`);

      sendRtcIceCandidate({
        candidate: candidate.candidate,
        sdpMid: candidate.sdpMid!,
        sdpMLineIndex: candidate.sdpMLineIndex!,
        recipientId: user.id,
      });
    });

    onNegotiationNeeded(peerConnection, (offer) => {
      logSignaling(`🛫 Sending an offer to remote user (as offerer) ${user.id}`);

      sendRtcOffer({
        offer: offer.sdp!,
        recipientId: user.id,
      });
    });

    onPeerConnectionConnected(peerConnection, () => {
      logRtc(`✅ Connection established with remote user ${user.id}`);

      onConnected({
        user,
        mediaStream,
      });
    });

    onPeerConnectionDisconnected(peerConnection, () => {
      logRtc(`❌ Connection closed with remote user ${user.id}`);

      onDisconnected({ user });
    });

    // Create an offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    if (userMedia) {
      userMedia.getTracks().forEach((track) => {
        logMedia(`🏗 Adding a remote track for user ${user.id}`);
        peerConnection.addTrack(track, userMedia);
      });
    }

    // Send the offer
    logSignaling(`🛫 Sending an offer to remote user ${user.id}`);

    await sendRtcOffer({
      offer: offer.sdp!,
      recipientId: user.id,
    });
  };
};
