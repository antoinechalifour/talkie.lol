import { useMutation } from "urql";

import { ConferenceViewModel } from "../viewmodels/ConferenceViewModel";
import { RemotePeer } from "../models/RemotePeer";
import { RemoteUser } from "../models/RemoteUser";
import { UserPayload } from "./types";
import {
  SEND_RTC_ICE_CANDIDATE,
  SEND_RTC_OFFER,
  SendRtcIceCandidateVariables,
  SendRtcOfferVariables,
} from "./signaling";
import { logSignaling } from "./log";

export const useSpaceJoinedHandler = (conference: ConferenceViewModel) => {
  const [, sendRtcOffer] = useMutation<unknown, SendRtcOfferVariables>(
    SEND_RTC_OFFER
  );
  const [, sendRtcIceCandidate] = useMutation<
    unknown,
    SendRtcIceCandidateVariables
  >(SEND_RTC_ICE_CANDIDATE);

  return async (user: UserPayload) => {
    logSignaling(`[IN] SPACE_JOINED | ${user.name} ${user.id}`);

    const remoteUser = RemoteUser.create(user.id, user.name);

    // Create the connection
    const remotePeer = RemotePeer.create(remoteUser, {
      onIceCandidate: (candidate) => {
        logSignaling(
          `[OUT] Ice Candidate | ${remoteUser.name()} ${remoteUser.id()}`
        );

        sendRtcIceCandidate({
          candidate: candidate.candidate,
          sdpMid: candidate.sdpMid!,
          sdpMLineIndex: candidate.sdpMLineIndex!,
          recipientId: remoteUser.id(),
        });
      },
      onNegociationNeeded: (offer) => {
        logSignaling(
          `[OUT] Offer (as offerer) | ${remoteUser.name()} ${remoteUser.id()}`
        );

        sendRtcOffer({
          offer: offer.sdp!,
          recipientId: remoteUser.id(),
        });
      },
      onDisconnected: () => conference.removeRemotePeer(remotePeer),
    });

    conference.addRemotePeer(remotePeer);

    // Create an offer
    const offer = await remotePeer.createOffer();
    await remotePeer.setLocalDescription(offer);

    // Send the offer
    logSignaling(`[OUT] Offer | ${remoteUser.name()} ${remoteUser.id()}`);

    await sendRtcOffer({
      offer: offer.sdp!,
      recipientId: remoteUser.id(),
    });
  };
};
