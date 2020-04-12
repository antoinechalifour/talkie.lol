import { useMutation } from "urql";

import { RemotePeer } from "../models/RemotePeer";
import { User } from "./types";
import {
  SEND_RTC_ANSWER,
  SEND_RTC_ICE_CANDIDATE,
  SEND_RTC_OFFER,
  SendRtcAnswerVariables,
  SendRtcIceCandidateVariables,
  SendRtcOfferVariables,
} from "./signaling";
import { logSignaling } from "./log";
import { Conference } from "../models/Conference";

export const useRtcOfferReceivedHandler = (conference: Conference) => {
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
    const remotePeer = RemotePeer.create(sender, {
      onIceCandidate: (candidate) => {
        logSignaling(`[OUT] Ice Candidate | ${sender.name} ${sender.id}`);

        sendRtcIceCandidate({
          candidate: candidate.candidate,
          sdpMid: candidate.sdpMid!,
          sdpMLineIndex: candidate.sdpMLineIndex!,
          recipientId: sender.id,
        });
      },
      onNegociationNeeded: (offer) => {
        logSignaling(`[OUT] Offer (as answerer) | ${sender.name} ${sender.id}`);

        sendRtcOffer({
          offer: offer.sdp!,
          recipientId: sender.id,
        });
      },
      onConnected: () => conference.addRemotePeer(remotePeer),
      onDisconnected: () => conference.removeRemotePeer(remotePeer),
    });

    return remotePeer;
  }

  return async (sender: User, offer: RTCSessionDescriptionInit) => {
    logSignaling(`[IN] Offer | ${sender.name} ${sender.id}`);

    const remotePeerFromCache = conference.remotePeerByUser(sender);
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
    logSignaling(`[OUT] Answer | ${sender.name} ${sender.id}`);

    await sendRtcAnswer({
      answer: answer.sdp!,
      recipientId: sender.id,
    });
  };
};
