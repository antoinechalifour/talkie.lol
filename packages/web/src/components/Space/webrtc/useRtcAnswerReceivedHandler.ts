import { User } from "./types";
import { logSignaling } from "./log";
import { Conference } from "../models/Conference";

export const useRtcAnswerReceivedHandler = (conference: Conference) => {
  return async (sender: User, answer: RTCSessionDescriptionInit) => {
    logSignaling(`📪 Received an answer from remote user ${sender.id}`);

    // TODO: apply demeter
    const remotePeer = conference.getRemotePeerByUser(sender);

    if (!remotePeer) return;

    await remotePeer.setRemoteDescription(answer);
  };
};
