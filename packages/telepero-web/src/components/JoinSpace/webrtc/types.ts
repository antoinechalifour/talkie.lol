export type PeerConnections = Map<string, RTCPeerConnection>;

export interface OnConnectedEvent {
  user: User
  mediaStream: MediaStream;
}

export interface OnDisconnectedEvent {
  user: User
}

export interface User {
  id: string,
  name: string
}