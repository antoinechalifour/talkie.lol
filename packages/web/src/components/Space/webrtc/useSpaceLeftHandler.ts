import { ConferenceViewModel } from "../viewmodels/ConferenceViewModel";
import { RemoteUser } from "../models/RemoteUser";
import { logSignaling } from "./log";
import { UserPayload } from "./types";

export const useSpaceLeftHandler = (conference: ConferenceViewModel) => (
  user: UserPayload
) => {
  logSignaling(`📫 User ${user.id} left the space`);

  conference.removeRemoteUser(RemoteUser.create(user.id, user.name));
};
