import { User } from "./types";
import { logSignaling } from "./log";
import { Conference } from "../models/Conference";

export const useRtcIceCandidateReceivedHandler = (conference: Conference) => {
  return async (sender: User, iceCandidate: RTCIceCandidateInit) => {
    logSignaling(`[IN] Ice Candidate | ${sender.name} ${sender.id}`);

    const remotePeer = conference.remotePeerByUser(sender);

    if (!remotePeer) return;

    await remotePeer.addIceCandidate(iceCandidate);
  };
};
