import {
  MockMediaStream,
  MockMediaStreamTrack,
} from "../test-utils/mediaStream";
import { RemotePeer } from "./RemotePeer";
import { RemoteUser } from "./RemoteUser";
import { MockRtcPeerConnection } from "../test-utils/rtcPeerConnection";
import { MockRtcDataChannel } from "../test-utils/rtcDataChannel";
import { flushPromises } from "../test-utils/flushPromises";
import { MockRemotePeer } from "../test-utils/remotePeer";

const getDefaultTestUser = () => RemoteUser.create("user-1", "John Doe");
const getTestRemotePeer = (remoteUser: RemoteUser) =>
  MockRemotePeer.create(
    remoteUser,
    MockRtcPeerConnection.create(),
    MockMediaStream.create(),
    MockRtcDataChannel.create()
  );

describe("RemotePeer", () => {
  describe("offerer", () => {
    let remotePeer: RemotePeer;
    let rtcConfiguration: RTCConfiguration;
    let rtcPeerConnection: RTCPeerConnection;
    let rtcDataChannel: RTCDataChannel;
    let mediaStream: MediaStream;
    let onMessage: jest.Mock;
    let onDisconnected: jest.Mock;
    let onNegociationNeeded: jest.Mock;
    let onIceCandidate: jest.Mock;

    beforeEach(() => {
      rtcConfiguration = {
        iceServers: [],
      };
      onMessage = jest.fn();
      onDisconnected = jest.fn();
      onNegociationNeeded = jest.fn();
      onIceCandidate = jest.fn();

      rtcDataChannel = MockRtcDataChannel.create();
      mediaStream = MockMediaStream.create();
      rtcPeerConnection = MockRtcPeerConnection.create();

      (rtcPeerConnection.createDataChannel as jest.Mock).mockReturnValue(
        rtcDataChannel
      );

      // @ts-ignore
      window.RTCPeerConnection = function () {
        return rtcPeerConnection;
      };

      // @ts-ignore
      window.MediaStream = function () {
        return mediaStream;
      };

      remotePeer = RemotePeer.createOfferer(getDefaultTestUser(), {
        onMessage,
        rtcConfiguration,
        onDisconnected,
        onNegociationNeeded,
        onIceCandidate,
      });
    });

    describe("mediaStream", () => {
      it("should return the media stream", () => {
        // Then
        expect(remotePeer.mediaStream()).toEqual(mediaStream);
      });
    });

    describe("is", () => {
      it("should return false if the other peer is null", () => {
        expect(remotePeer.is(null)).toBe(false);
      });

      it("should return false if the other peer does not have the same id", () => {
        // Given
        const otherPeer = getTestRemotePeer(
          RemoteUser.create("other-peer", "Jane Doe")
        );

        // Then
        expect(remotePeer.is(otherPeer)).toBe(false);
      });

      it("should return true if the other peer as the same ID", () => {
        // Given
        const otherPeer = getTestRemotePeer(
          RemoteUser.create(remotePeer.id(), "Jane Doe")
        );

        // Then
        expect(remotePeer.is(otherPeer)).toBe(true);
      });
    });

    describe("isUser", () => {
      it("should return true if the user is the same", () => {});

      it("should return false otherwise", () => {
        const otherUser = RemoteUser.create("other-user", "Jane DOe");
        expect(remotePeer.isUser(otherUser)).toBe(false);
      });
    });

    describe("data channel creation", () => {
      it('should create the data channel "chat"', () => {
        // Then
        expect(rtcPeerConnection.createDataChannel).toHaveBeenCalledTimes(1);
        expect(rtcPeerConnection.createDataChannel).toHaveBeenCalledWith(
          "chat"
        );
      });
    });

    describe("ice candidates handling", () => {
      it("should call onIceCandidate when the connection receives ice candidates", () => {
        // Given
        const candidate = {};
        const event: any = {
          type: "icecandidate",
          candidate,
        };

        // When
        rtcPeerConnection.dispatchEvent(event);

        // Then
        expect(onIceCandidate).toHaveBeenCalledTimes(1);
        expect(onIceCandidate).toHaveBeenCalledWith(candidate);
      });

      it("should not call onIceCandidate when the event has a null candidate", () => {
        // Given
        const candidate = null;
        const event: any = {
          type: "icecandidate",
          candidate,
        };

        // When
        rtcPeerConnection.dispatchEvent(event);

        // Then
        expect(onIceCandidate).not.toHaveBeenCalled();
      });
    });

    describe("negotiation handling", () => {
      it("should not handle negotiation when the signaling state is not stable", async () => {
        // Given
        const event: any = { type: "negotiationneeded" };
        // @ts-ignore
        rtcPeerConnection.signalingState = "closed";

        // When
        rtcPeerConnection.dispatchEvent(event);

        await flushPromises();

        // Then
        expect(rtcPeerConnection.setLocalDescription).not.toHaveBeenCalled();
        expect(onNegociationNeeded).not.toHaveBeenCalled();
      });

      it("should handle negotiation when the signaling state is stable", async () => {
        // Given
        const event: any = { type: "negotiationneeded" };
        const offer: RTCSessionDescription = {
          sdp: "sdp",
          toJSON: jest.fn(),
          type: "offer",
        };
        (rtcPeerConnection.createOffer as jest.Mock).mockResolvedValue(offer);
        // @ts-ignore
        rtcPeerConnection.signalingState = "stable";

        // When
        rtcPeerConnection.dispatchEvent(event);

        await flushPromises();

        // Then
        expect(rtcPeerConnection.setLocalDescription).toHaveBeenCalledTimes(1);
        expect(rtcPeerConnection.setLocalDescription).toHaveBeenCalledWith(
          offer
        );
        expect(onNegociationNeeded).toHaveBeenCalledTimes(1);
        expect(onNegociationNeeded).toHaveBeenCalledWith(offer);
      });
    });

    describe("connection / disconnection handling", () => {
      it("should be disconnected by default", () => {
        // Then
        expect(remotePeer.isConnected).toBe(false);
      });

      it('should be connected when the signaling state is "stable"', () => {
        // Given
        const event: any = {
          type: "signalingstatechange",
        };
        // @ts-ignore
        rtcPeerConnection.signalingState = "stable";

        // When
        rtcPeerConnection.dispatchEvent(event);

        // Then
        expect(remotePeer.isConnected).toBe(true);
      });

      it("should be disconnected  when the ice connection state is disconnected", () => {
        // Given
        const connectEvent: any = {
          type: "signalingstatechange",
        };
        // @ts-ignore
        rtcPeerConnection.signalingState = "stable";
        rtcPeerConnection.dispatchEvent(connectEvent);
        expect(remotePeer.isConnected).toBe(true);
        const disconnectEvent: any = {
          type: "connectionstatechange",
        };
        // @ts-ignore
        rtcPeerConnection.connectionState = "closed";

        // When
        rtcPeerConnection.dispatchEvent(disconnectEvent);

        // Then
        expect(remotePeer.isConnected).toBe(false);
      });

      it("should call the onDisconnected callback when the ice connection state is disconnected", () => {
        // Given
        const event: any = {
          type: "iceconnectionstatechange",
        };
        // @ts-ignore
        rtcPeerConnection.iceConnectionState = "disconnected";

        // When
        rtcPeerConnection.dispatchEvent(event);

        // Then
        expect(onDisconnected).toHaveBeenCalledTimes(1);
      });

      it("should call the onDisconnected callback when the connection state is closed", () => {
        // Given
        const event: any = {
          type: "connectionstatechange",
        };
        // @ts-ignore
        rtcPeerConnection.connectionState = "closed";

        // When
        rtcPeerConnection.dispatchEvent(event);

        // Then
        expect(onDisconnected).toHaveBeenCalledTimes(1);
      });
    });

    describe("handling track events", () => {
      let oldAudioTrack: MediaStreamTrack;
      let oldVideoTrack: MediaStreamTrack;
      let newAudioTrack: MediaStreamTrack;
      let addTrackSubscriber: jest.Mock;
      let removeTrackSubscriber: jest.Mock;

      beforeEach(() => {
        addTrackSubscriber = jest.fn();
        removeTrackSubscriber = jest.fn();

        oldAudioTrack = MockMediaStreamTrack.createAudioTrack("audio-1");
        oldVideoTrack = MockMediaStreamTrack.createVideoTrack("video-1");
        newAudioTrack = MockMediaStreamTrack.createAudioTrack("audio-2");

        mediaStream.addTrack(oldAudioTrack);
        mediaStream.addTrack(oldVideoTrack);

        mediaStream.addEventListener("addtrack", addTrackSubscriber);
        mediaStream.addEventListener("removetrack", removeTrackSubscriber);
      });

      afterEach(() => {
        mediaStream.removeEventListener("addtrack", addTrackSubscriber);
        mediaStream.removeEventListener("removetrack", removeTrackSubscriber);
      });

      it("should remove the old tracks of the same kind", () => {
        // Given
        const event: any = {
          type: "track",
          track: newAudioTrack,
        };

        // When
        rtcPeerConnection.dispatchEvent(event);

        // Then
        expect(mediaStream.getTracks()).toEqual([oldVideoTrack, newAudioTrack]);
      });

      it("should dispatch events", () => {
        // Given
        const event: any = {
          type: "track",
          track: newAudioTrack,
        };

        // When
        rtcPeerConnection.dispatchEvent(event);

        // Then
        expect(addTrackSubscriber).toHaveBeenCalledTimes(1);
        expect(addTrackSubscriber).toHaveBeenCalledWith(
          expect.objectContaining({
            track: newAudioTrack,
          })
        );

        expect(removeTrackSubscriber).toHaveBeenCalledTimes(1);
        expect(removeTrackSubscriber).toHaveBeenCalledWith(
          expect.objectContaining({
            track: oldAudioTrack,
          })
        );
      });
    });

    describe("handling new messages", () => {
      it("should rebuild the messages from the chunks and call onMessage", () => {
        // Given
        const events: any[] = [
          {
            type: "message",
            data: "start:text:1",
          },
          {
            type: "message",
            data: "Hello world",
          },
          {
            type: "message",
            data: "start:image:2",
          },
          {
            type: "message",
            data: "img-chunk-1/",
          },
          {
            type: "message",
            data: "img-chunk-2",
          },
          {
            type: "message",
            data: "start:text:2",
          },
          {
            type: "message",
            data: "text-chunk-1/",
          },
          {
            type: "message",
            data: "text-chunk-2",
          },
        ];

        // When
        events.forEach((event) => rtcDataChannel.dispatchEvent(event));

        // Then
        const author = {
          id: remotePeer.id(),
          name: remotePeer.name(),
        };
        const message1 = onMessage.mock.calls[0][0];
        const message2 = onMessage.mock.calls[1][0];
        const message3 = onMessage.mock.calls[2][0];

        expect(onMessage).toHaveBeenCalledTimes(3);

        expect(message1.author()).toEqual(author);
        expect(message1.type()).toEqual("text");
        expect(message1.content()).toEqual("Hello world");

        expect(message2.author()).toEqual(author);
        expect(message2.type()).toEqual("image");
        expect(message2.content()).toEqual("img-chunk-1/img-chunk-2");

        expect(message3.author()).toEqual(author);
        expect(message3.type()).toEqual("text");
        expect(message3.content()).toEqual("text-chunk-1/text-chunk-2");
      });
    });
  });

  describe("answerer", () => {
    let remotePeer: RemotePeer;
    let rtcConfiguration: RTCConfiguration;
    let rtcPeerConnection: RTCPeerConnection;
    let rtcDataChannel: RTCDataChannel;
    let mediaStream: MediaStream;

    beforeEach(() => {
      rtcConfiguration = {
        iceServers: [],
      };

      rtcDataChannel = MockRtcDataChannel.create();
      mediaStream = MockMediaStream.create();
      rtcPeerConnection = MockRtcPeerConnection.create();

      // @ts-ignore
      window.RTCPeerConnection = function () {
        return rtcPeerConnection;
      };

      // @ts-ignore
      window.MediaStream = function () {
        return mediaStream;
      };

      remotePeer = RemotePeer.createAnswerer(getDefaultTestUser(), {
        onMessage: jest.fn(),
        rtcConfiguration,
        onDisconnected: jest.fn(),
        onNegociationNeeded: jest.fn(),
        onIceCandidate: jest.fn(),
      });
    });

    describe("mediaStream", () => {
      it("should return the media stream", () => {
        expect(remotePeer.mediaStream()).toEqual(mediaStream);
      });
    });

    describe("data channel handling", () => {
      it("should set the data channel when received", () => {
        // Given
        const spyAddEventListener = jest.spyOn(
          rtcDataChannel,
          "addEventListener"
        );
        const event: any = {
          type: "datachannel",
          channel: rtcDataChannel,
        };

        // When
        rtcPeerConnection.dispatchEvent(event);

        // Then
        expect(spyAddEventListener).toHaveBeenCalled();
      });
    });
  });
});
