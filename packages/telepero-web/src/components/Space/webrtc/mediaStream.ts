import { logMedia } from "./log";

export const createMediaStreamForPeerConnection = (
  peerConnection: RTCPeerConnection
) => {
  const mediaStream = new MediaStream();

  peerConnection.addEventListener("track", ({ track }) => {
    logMedia(`📫 Received track event (${track.kind} / ${track.id})`);

    mediaStream.addTrack(track);
  });

  return mediaStream;
};
