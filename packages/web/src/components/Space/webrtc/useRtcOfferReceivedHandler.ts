import { useMutation } from "urql";

import { RemotePeer } from "../RemotePeer";
import { PeerConnections, User } from "./types";
import {
  SEND_RTC_ANSWER,
  SEND_RTC_ICE_CANDIDATE,
  SEND_RTC_OFFER,
  SendRtcAnswerVariables,
  SendRtcIceCandidateVariables,
  SendRtcOfferVariables,
} from "./signaling";
import { logSignaling } from "./log";

interface UseRtcOfferReceivedHandlerOptions {
  peerConnections: PeerConnections;
  onConnected: (remotePeer: RemotePeer) => void;
  onDisconnected: (remotePeer: RemotePeer) => void;
}

export const useRtcOfferReceivedHandler = ({
  peerConnections,
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

  async function handleFirstConnection(sender: User) {
    // Create the connection
    const remotePeer = RemotePeer.create(sender);
    peerConnections.set(sender.id, remotePeer);
    remotePeer.debugRtc();

    // Create the media stream
    remotePeer.onNegociationNeeded((offer) => {
      logSignaling(
        `🛫 Sending an new offer to remote user (as answerer) ${sender.id}`
      );

      sendRtcOffer({
        offer: offer.sdp!,
        recipientId: sender.id,
      });
    });

    // Send ice candidate as they arrive
    remotePeer.onIceCandidate((candidate) => {
      logSignaling(`🛫 Sending an ice candidate to remote user ${sender.id}`);

      sendRtcIceCandidate({
        candidate: candidate.candidate,
        sdpMid: candidate.sdpMid!,
        sdpMLineIndex: candidate.sdpMLineIndex!,
        recipientId: sender.id,
      });
    });

    remotePeer.onConnected(() => onConnected(remotePeer));

    remotePeer.onDisconnected(() => onDisconnected(remotePeer));

    return remotePeer;
  }

  return async (sender: User, offer: RTCSessionDescriptionInit) => {
    logSignaling(`📫 Received an offer from remote user ${sender.id}`);

    const remotePeerFromCache = peerConnections.get(sender.id);
    let remotePeer: RemotePeer;

    if (remotePeerFromCache) {
      remotePeer = remotePeerFromCache;
    } else {
      remotePeer = await handleFirstConnection(sender);
    }

    // Create an answer
    await remotePeer.setRemoteDescription(offer);
    const answer = await remotePeer.createAnswer();
    await remotePeer.setLocalDescription(answer);

    // Send the answer
    logSignaling(`🛫 Sending an answer to remote user ${sender.id}`);

    await sendRtcAnswer({
      answer: answer.sdp!,
      recipientId: sender.id,
    });
  };
};
