import { RemotePeer } from "../RemotePeer";

export type PeerConnections = Map<string, RemotePeer>;

export interface User {
  id: string;
  name: string;
}
