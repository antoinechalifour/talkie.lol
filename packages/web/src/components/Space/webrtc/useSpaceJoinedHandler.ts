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
    logSignaling(`[IN] SPACE_JOINED | ${user.name} ${user.id}`);

    // Create the connection
    const remotePeer = RemotePeer.create(user, {
      onIceCandidate: (candidate) => {
        logSignaling(`[OUT] Ice Candidate | ${user.name} ${user.id}`);

        sendRtcIceCandidate({
          candidate: candidate.candidate,
          sdpMid: candidate.sdpMid!,
          sdpMLineIndex: candidate.sdpMLineIndex!,
          recipientId: user.id,
        });
      },
      onNegociationNeeded: (offer) => {
        logSignaling(`[OUT] Offer (as offerer) | ${user.name} ${user.id}`);

        sendRtcOffer({
          offer: offer.sdp!,
          recipientId: user.id,
        });
      },
      onDisconnected: () => conference.removeRemotePeer(remotePeer),
    });

    conference.addRemotePeer(remotePeer);

    // Create an offer
    const offer = await remotePeer.createOffer();
    await remotePeer.setLocalDescription(offer);

    // Send the offer
    logSignaling(`[OUT] Offer | ${user.name} ${user.id}`);

    await sendRtcOffer({
      offer: offer.sdp!,
      recipientId: user.id,
    });
  };
};
