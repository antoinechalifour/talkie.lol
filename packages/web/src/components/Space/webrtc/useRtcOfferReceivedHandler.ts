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
        logSignaling(`🛫 Sending an ice candidate to remote user ${sender.id}`);

        sendRtcIceCandidate({
          candidate: candidate.candidate,
          sdpMid: candidate.sdpMid!,
          sdpMLineIndex: candidate.sdpMLineIndex!,
          recipientId: sender.id,
        });
      },
      onNegociationNeeded: (offer) => {
        logSignaling(
          `🛫 Sending an new offer to remote user (as answerer) ${sender.id}`
        );

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
    logSignaling(`📫 Received an offer from remote user ${sender.id}`);

    const remotePeerFromCache = conference.getRemotePeerByUser(sender);
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
