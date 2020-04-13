import { Conference } from "../models/Conference";
import { User } from "./types";
import { logSignaling } from "./log";

export const useRtcAnswerReceivedHandler = (conference: Conference) => {
  return async (sender: User, answer: RTCSessionDescriptionInit) => {
    logSignaling(`[IN] Answer | ${sender.name} ${sender.id}`);

    const remotePeer = conference.remotePeerByUser(sender);

    if (!remotePeer) return;

    await remotePeer.setRemoteDescription(answer);
  };
};
