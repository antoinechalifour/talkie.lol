import { logRtc } from "./log";

const peerConnectionConfiguration: RTCConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"],
    },
    {
      urls: ["stun:stun1.l.google.com:19302"],
    },
    {
      urls: ["stun:stun2.l.google.com:19302"],
    },
  ],
};

export const createPeerConnection = () =>
  new RTCPeerConnection(peerConnectionConfiguration);

type IceCandidateCallback = (candidate: RTCIceCandidate) => void;

export const onIceCandidate = (
  peerConnection: RTCPeerConnection,
  callback: IceCandidateCallback
) => {
  peerConnection.addEventListener("icecandidate", (e) => {
    if (!e.candidate) {
      return;
    }

    callback(e.candidate);
  });
};

type OfferCallback = (offer: RTCSessionDescriptionInit) => void;

export const onNegotiationNeeded = (
  peerConnection: RTCPeerConnection,
  callback: OfferCallback
) => {
  peerConnection.addEventListener("negotiationneeded", async () => {
    logRtc("⚠️ Negociation needed");

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    callback(offer);
  });
};

export const onPeerConnectionConnected = (
  peerConnection: RTCPeerConnection,
  callback: () => void
) => {
  peerConnection.addEventListener("connectionstatechange", () => {
    if (peerConnection.connectionState === "connected") {
      callback();
    }
  });
};

export const onPeerConnectionDisconnected = (
  peerConnection: RTCPeerConnection,
  callback: () => void
) => {
  peerConnection.addEventListener("connectionstatechange", () => {
    if (
      peerConnection.connectionState === "closed" ||
      peerConnection.connectionState === "disconnected"
    ) {
      callback();
    }
  });
};
