export type PeerConnections = Map<string, RTCPeerConnection>;

export interface OnConnectedEvent {
  userId: string;
  mediaStream: MediaStream;
}

export interface OnDisconnectedEvent {
  userId: string;
}
