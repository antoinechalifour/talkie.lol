import { mockRtcConfiguration } from "../test-utils/rtcConfiguration";
import { mockMediaStream } from "../test-utils/mediaStream";
import { mockRemotePeer } from "../test-utils/remotePeer";
import { mockRtcPeerConnection } from "../test-utils/rtcPeerConnection";
import { mockRtcDataChannel } from "../test-utils/rtcDataChannel";

import { Conference } from "./Conference";
import { CurrentUser } from "./CurrentUser";
import { RemoteUser } from "./RemoteUser";

describe("Conference", () => {
  describe("addRemotePeer", () => {
    describe("when the peer is not in the conference", () => {
      it("should add the peer and start streaming media with them", () => {
        // Given
        const mediaStream = mockMediaStream();
        const currentUser = CurrentUser.create(
          "current-user",
          "current-user-token",
          "current-user-name",
          mockRtcConfiguration(),
          mediaStream
        );
        const conference = Conference.create("conference-name", currentUser);
        const newRemotePeer = mockRemotePeer(
          RemoteUser.create("user-1", "Jane Doe"),
          mockRtcPeerConnection(),
          mockMediaStream(),
          mockRtcDataChannel()
        );

        // When
        conference.addRemotePeer(newRemotePeer);

        // Then
        expect(conference.allRemotePeers()).toEqual([newRemotePeer]);

        // TODO: assert stuff on the peer connection
      });
    });

    describe("when the peer is already in the conference", () => {
      it("should not add the peer", () => {
        // Given
        const mediaStream = mockMediaStream();
        const currentUser = CurrentUser.create(
          "current-user",
          "current-user-token",
          "current-user-name",
          mockRtcConfiguration(),
          mediaStream
        );
        const conference = Conference.create("conference-name", currentUser);
        const newRemotePeer = mockRemotePeer(
          RemoteUser.create("user-1", "Jane Doe"),
          mockRtcPeerConnection(),
          mockMediaStream(),
          mockRtcDataChannel()
        );

        // When
        conference.addRemotePeer(newRemotePeer);
        conference.addRemotePeer(newRemotePeer);

        // Then
        expect(conference.allRemotePeers()).toEqual([newRemotePeer]);
      });
    });
  });

  describe("removeRemotePeer", () => {
    it.todo("should remove the peer from the conference");
  });

  describe("removeRemoteUser", () => {
    describe("when the user is in the conference", () => {
      it.todo("should remove the peer associated with the user");
    });

    describe("when the user is not in the conference", () => {
      it.todo("should do nothing");
    });
  });

  describe("remotePeerByUser", () => {
    it.todo("should return the peer associated with the user");
  });

  describe("userById", () => {
    describe("when the user is in the conference", () => {
      it.todo("should return the peer");
    });

    describe("when the user is not in the conference", () => {
      it.todo("should throw an error");
    });
  });

  describe("allRemotePeers", () => {
    it.todo("should return all the peers");
  });

  describe("startLocalAudio", () => {
    it.todo("should set the local audio stream");
    it.todo("should share the audio stream with all the peers");
  });

  describe("stopLocalAudio", () => {
    it.todo("should remove the local video stream");
    it.todo("should stop sending the video stream to other peers");
  });

  describe("startLocalVideo", () => {
    it.todo("should set the local video stream");
    it.todo("should share the video stream with all the peers");
  });

  describe("stopLocalVideo", () => {
    it.todo("should remove the local video stream");
    it.todo("should stop sending the video stream to other peers");
  });

  describe("sendMessage", () => {
    it.todo("should add the message to the messages queue");
    it.todo("should send the message to all the peers");
  });

  describe("sendImage", () => {
    it.todo("should add the message to the messages queue");
    it.todo("should send the message to all the peers");
  });

  describe("addMessage", () => {
    it.todo("should add the message to the messages queue");
  });

  describe("leave", () => {
    it.todo("should stop the audio stream");
    it.todo("should stop the video stream");
    it.todo("should close the connection to each peer");
  });
});
