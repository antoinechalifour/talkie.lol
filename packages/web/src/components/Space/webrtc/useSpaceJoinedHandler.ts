import { useMutation } from "urql";

import { RemotePeer } from "../models/RemotePeer";
import { Conference } from "../models/Conference";
import { User } from "./types";
import {
  SEND_RTC_ICE_CANDIDATE,
  SEND_RTC_OFFER,
  SendRtcIceCandidateVariables,
  SendRtcOfferVariables,
} from "./signaling";
import { logSignaling } from "./log";

export const useSpaceJoinedHandler = (conference: Conference) => {
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
    const remotePeer = RemotePeer.create(user, {
      onIceCandidate: (candidate) => {
        logSignaling(`🛫 Sending an ice candidate to remote user ${user.id}`);

        sendRtcIceCandidate({
          candidate: candidate.candidate,
          sdpMid: candidate.sdpMid!,
          sdpMLineIndex: candidate.sdpMLineIndex!,
          recipientId: user.id,
        });
      },
      onNegociationNeeded: (offer) => {
        logSignaling(
          `🛫 Sending an offer to remote user (as offerer) ${user.id}`
        );

        sendRtcOffer({
          offer: offer.sdp!,
          recipientId: user.id,
        });
      },
      onConnected: () => conference.addRemotePeer(remotePeer),
      onDisconnected: () => conference.removeRemotePeer(remotePeer),
    });

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
