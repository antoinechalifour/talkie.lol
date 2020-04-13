import { Conference } from "../models/Conference";
import { RemoteUser } from "../models/RemoteUser";
import { UserPayload } from "./types";
import { logSignaling } from "./log";

export const useRtcAnswerReceivedHandler = (conference: Conference) => {
  return async (sender: UserPayload, answer: RTCSessionDescriptionInit) => {
    logSignaling(`[IN] Answer | ${sender.name} ${sender.id}`);

    const remotePeer = conference.remotePeerByUser(
      RemoteUser.create(sender.id, sender.name)
    );

    if (!remotePeer) return;

    await remotePeer.setRemoteDescription(answer);
  };
};
