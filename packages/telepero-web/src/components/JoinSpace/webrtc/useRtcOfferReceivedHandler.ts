import { useMutation } from "urql";
import { PeerConnections } from "./types";
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
} from "./peerConnection";
import { createMediaStreamForPeerConnection } from "./mediaStream";

interface UseRtcOfferReceivedHandlerOptions {
  peerConnections: PeerConnections;
  userMedia: MediaStream | null;
}

export const useRtcOfferReceivedHandler = ({
  peerConnections,
  userMedia,
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

  async function handleNegotiation(peerConnection: RTCPeerConnection) {}

  async function handleFirstConnection(
    senderId: string,
    userMedia: MediaStream | null
  ) {
    // Create the connection
    logRtc(`🏗 Creating a peer connection for remote user ${senderId}`);
    const peerConnection = createPeerConnection();
    peerConnections.set(senderId, peerConnection);

    // Create the media stream
    const mediaStream = createMediaStreamForPeerConnection(peerConnection);

    onNegotiationNeeded(peerConnection, (offer) => {
      logSignaling(
        `🛫 Sending an new offer to remote user (as answerer) ${senderId}`
      );

      sendRtcOffer({
        offer: offer.sdp!,
        recipientId: senderId,
      });
    });

    // Send ice candidate as they arrive
    onIceCandidate(peerConnection, (candidate) => {
      logSignaling(`🛫 Sending an ice candidate to remote user ${senderId}`);

      sendRtcIceCandidate({
        candidate: candidate.candidate,
        sdpMid: candidate.sdpMid!,
        sdpMLineIndex: candidate.sdpMLineIndex!,
        recipientId: senderId,
      });
    });

    if (userMedia) {
      userMedia.getTracks().forEach((track) => {
        logMedia(`🛫 Sending a remote track for user ${senderId}`);

        peerConnection.addTrack(track, userMedia);
      });
    }

    return { peerConnection, mediaStream };
  }

  return async (senderId: string, offer: RTCSessionDescriptionInit) => {
    logSignaling(`📫 Received an offer from remote user ${senderId}`);

    const existingPeerConnection = peerConnections.get(senderId);
    let peerConnection: RTCPeerConnection;
    let mediaStream: MediaStream | null = null;

    if (existingPeerConnection) {
      logRtc(`🏗 Renegotiation for remote user ${senderId}`);
      peerConnection = existingPeerConnection;

      await handleNegotiation(peerConnection);
    } else {
      const connection = await handleFirstConnection(senderId, userMedia);

      peerConnection = connection.peerConnection;
      mediaStream = connection.mediaStream;
    }

    // Create an answer
    await peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    // Send the answer
    logSignaling(`🛫 Sending an answer to remote user ${senderId}`);

    await sendRtcAnswer({
      answer: answer.sdp!,
      recipientId: senderId,
    });

    return { mediaStream };
  };
};
