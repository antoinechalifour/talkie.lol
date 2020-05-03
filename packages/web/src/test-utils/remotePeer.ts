import { RemotePeer } from "../models/RemotePeer";
import { RemoteUser } from "../models/RemoteUser";

export const mockRemotePeer = (
  remoteUser: RemoteUser,
  rtcPeerConnection: RTCPeerConnection,
  mediaStream: MediaStream,
  dataChannel: RTCDataChannel
): RemotePeer =>
  new (class extends RemotePeer {
    constructor() {
      super(remoteUser, rtcPeerConnection, mediaStream, dataChannel);
    }
  })();
