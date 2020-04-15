import { useRemotePeers } from "../../hooks/useRemotePeers";
import { useLocalUser } from "../../hooks/useLocalUser";

export const useMediaGridView = () => {
  const localUser = useLocalUser();
  const remotePeers = useRemotePeers();

  return { mainUser: localUser, otherUsers: remotePeers };
};
