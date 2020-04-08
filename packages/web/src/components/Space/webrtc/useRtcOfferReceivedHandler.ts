import { useMutation } from "urql";
import {
  OnConnectedEvent,
  OnDisconnectedEvent,
  PeerConnections,
  User,
} from "./types";
import {
  SEND_RTC_ANSWER,
  SEND_RTC_ICE_CANDIDATE,
  SEND_RTC_OFFER,
  SendRtcAnswerVariables,
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

interface UseRtcOfferReceivedHandlerOptions {
  peerConnections: PeerConnections;
  userMedia: MediaStream | null;
  onConnected: (e: OnConnectedEvent) => void;
  onDisconnected: (e: OnDisconnectedEvent) => void;
}

export const useRtcOfferReceivedHandler = ({
  peerConnections,
  userMedia,
  onConnected,
  onDisconnected,
}: UseRtcOfferReceivedHandlerOptions) => {
  const [, sendRtcOffer] = useMutation<unknown, SendRtcOfferVariables>(
    SEND_RTC_OFFER
  );
  const [, sendRtcAnswer] = useMutation<unknown, SendRtcAnswerVariables>(
    SEND_RTC_ANSWER
  );
  const [, sendRtcIceCandidate] = useMutation<
    unknown,
    SendRtcIceCandidateVariables
  >(SEND_RTC_ICE_CANDIDATE);

  async function handleFirstConnection(
    sender: User,
    userMedia: MediaStream | null
  ) {
    // Create the connection
    logRtc(`🏗 Creating a peer connection for remote user ${sender.id}`);
    const peerConnection = createPeerConnection();
    peerConnections.set(sender.id, peerConnection);

    // Create the media stream
    const mediaStream = createMediaStreamForPeerConnection(peerConnection);

    onNegotiationNeeded(peerConnection, (offer) => {
      logSignaling(
        `🛫 Sending an new offer to remote user (as answerer) ${sender.id}`
      );

      sendRtcOffer({
        offer: offer.sdp!,
        recipientId: sender.id,
      });
    });

    // Send ice candidate as they arrive
    onIceCandidate(peerConnection, (candidate) => {
      logSignaling(`🛫 Sending an ice candidate to remote user ${sender.id}`);

      sendRtcIceCandidate({
        candidate: candidate.candidate,
        sdpMid: candidate.sdpMid!,
        sdpMLineIndex: candidate.sdpMLineIndex!,
        recipientId: sender.id,
      });
    });

    onPeerConnectionConnected(peerConnection, () => {
      logRtc(`✅ Connection established with remote user ${sender.id}`);

      onConnected({
        user: sender,
        mediaStream,
      });
    });

    onPeerConnectionDisconnected(peerConnection, () => {
      logRtc(`❌ Connection closed with remote user ${sender.id}`);

      onDisconnected({ user: sender });
    });

    if (userMedia) {
      userMedia.getTracks().forEach((track) => {
        logMedia(`🛫 Sending a remote track for user ${sender.id}`);

        peerConnection.addTrack(track, userMedia);
      });
    }

    return peerConnection;
  }

  return async (sender: User, offer: RTCSessionDescriptionInit) => {
    logSignaling(`📫 Received an offer from remote user ${sender.id}`);

    const existingPeerConnection = peerConnections.get(sender.id);
    let peerConnection: RTCPeerConnection;

    if (existingPeerConnection) {
      logRtc(`🏗 Renegotiation for remote user ${sender.id}`);
      peerConnection = existingPeerConnection;
    } else {
      peerConnection = await handleFirstConnection(sender, userMedia);
    }

    // Create an answer
    await peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    // Send the answer
    logSignaling(`🛫 Sending an answer to remote user ${sender.id}`);

    await sendRtcAnswer({
      answer: answer.sdp!,
      recipientId: sender.id,
    });
  };
};
