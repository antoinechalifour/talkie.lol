import { PeerConnections } from "./types";
import { logSignaling } from "./log";

interface UseSpaceLeftHandlerOptions {
  peerConnections: PeerConnections;
}

export const useSpaceLeftHandler = ({
  peerConnections,
}: UseSpaceLeftHandlerOptions) => (userId: string) => {
  logSignaling(`📫 User ${userId} left the space`);

  peerConnections.delete(userId);
};
