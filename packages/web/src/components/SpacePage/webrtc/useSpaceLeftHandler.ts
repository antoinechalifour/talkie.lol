import { RemoteUser } from "../../../models/RemoteUser";
import { ConferenceViewModel } from "../../../viewmodels/ConferenceViewModel";
import { UserPayload } from "./types";
import { logSignaling } from "./signaling";

export const useSpaceLeftHandler = (conference: ConferenceViewModel) => (
  user: UserPayload
) => {
  logSignaling(`📫 User ${user.id} left the space`);

  conference.removeRemoteUser(RemoteUser.create(user.id, user.name));
};
