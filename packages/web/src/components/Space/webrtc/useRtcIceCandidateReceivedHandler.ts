import { User } from "./types";
import { logSignaling } from "./log";
import { Conference } from "../models/Conference";

export const useRtcIceCandidateReceivedHandler = (conference: Conference) => {
  return async (sender: User, iceCandidate: RTCIceCandidateInit) => {
    logSignaling(`📫 Received an ice candidate for remote user ${sender.id}`);

    // TODO: apply demeter
    const remotePeer = conference.getRemotePeerByUser(sender);

    if (!remotePeer) return;

    await remotePeer.addIceCandidate(iceCandidate);
  };
};
