import { RemotePeer } from "../models/RemotePeer";
import { RemoteUser } from "../models/RemoteUser";

export class MockRemotePeer extends RemotePeer {
  static create(
    remoteUser: RemoteUser,
    rtcPeerConnection: RTCPeerConnection,
    mediaStream: MediaStream,
    dataChannel: RTCDataChannel
  ) {
    return new RemotePeer(
      remoteUser,
      rtcPeerConnection,
      mediaStream,
      dataChannel
    );
  }
}
