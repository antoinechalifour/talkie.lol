import { Conference } from "../models/Conference";
import { logSignaling } from "./log";
import { User } from "./types";

export const useSpaceLeftHandler = (conference: Conference) => (user: User) => {
  logSignaling(`📫 User ${user.id} left the space`);

  conference.removeRemoteUser(user);
};
