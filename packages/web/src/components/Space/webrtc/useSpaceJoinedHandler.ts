import { useMutation } from "urql";

import { RemotePeer } from "../RemotePeer";
import { PeerConnections, User } from "./types";
import {
  SEND_RTC_ICE_CANDIDATE,
  SEND_RTC_OFFER,
  SendRtcIceCandidateVariables,
  SendRtcOfferVariables,
} from "./signaling";
import { logSignaling } from "./log";

interface UseSpaceJoinedHandlerOptions {
  peerConnections: PeerConnections;
  onConnected: (remotePeer: RemotePeer) => void;
  onDisconnected: (remotePeer: RemotePeer) => void;
}

export const useSpaceJoinedHandler = ({
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
    const remotePeer = RemotePeer.create(user);
    peerConnections.set(user.id, remotePeer);
    remotePeer.debugRtc();

    // Send ice candidate as they arrive
    remotePeer.onIceCandidate((candidate) => {
      logSignaling(`🛫 Sending an ice candidate to remote user ${user.id}`);

      sendRtcIceCandidate({
        candidate: candidate.candidate,
        sdpMid: candidate.sdpMid!,
        sdpMLineIndex: candidate.sdpMLineIndex!,
        recipientId: user.id,
      });
    });

    remotePeer.onNegociationNeeded((offer) => {
      logSignaling(
        `🛫 Sending an offer to remote user (as offerer) ${user.id}`
      );

      sendRtcOffer({
        offer: offer.sdp!,
        recipientId: user.id,
      });
    });

    remotePeer.onConnected(() => onConnected(remotePeer));

    remotePeer.onDisconnected(() => onDisconnected(remotePeer));

    // Create an offer
    const offer = await remotePeer.createOffer();
    await remotePeer.setLocalDescription(offer);

    // Send the offer
    logSignaling(`🛫 Sending an offer to remote user ${user.id}`);

    await sendRtcOffer({
      offer: offer.sdp!,
      recipientId: user.id,
    });
  };
};
