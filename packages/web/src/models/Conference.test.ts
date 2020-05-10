import { mockRtcConfiguration } from "../test-utils/rtcConfiguration";
import {
  MockMediaStream,
  MockMediaStreamTrack,
} from "../test-utils/mediaStream";
import { MockRemotePeer } from "../test-utils/remotePeer";
import { MockRtcPeerConnection } from "../test-utils/rtcPeerConnection";
import { MockRtcDataChannel } from "../test-utils/rtcDataChannel";

import { Conference } from "./Conference";
import { CurrentUser } from "./CurrentUser";
import { RemoteUser } from "./RemoteUser";
import { Author, Message } from "./Message";
import { MockRTCRtpSender } from "../test-utils/rtcRtpSender";

const getDefaultTestCurrentUser = () => {
  const mediaStream = MockMediaStream.create();
  return CurrentUser.create(
    "current-user",
    "current-user-token",
    "current-user-name",
    mockRtcConfiguration(),
    mediaStream
  );
};

const getDefaultTestConference = () =>
  Conference.create("conference-name", getDefaultTestCurrentUser());

const getTestConferenceWithLocalMediaStream = (mediaStream: MediaStream) => {
  const currentUser = CurrentUser.create(
    "current-user",
    "current-user-token",
    "current-user-name",
    mockRtcConfiguration(),
    mediaStream
  );

  return Conference.create("conference-name", currentUser);
};

const getDefaultTestRemotePeer = () =>
  MockRemotePeer.create(
    RemoteUser.create("user-1", "Jane Doe"),
    MockRtcPeerConnection.create(),
    MockMediaStream.create(),
    MockRtcDataChannel.create()
  );

const getTestRemotePeer = (remoteUser: RemoteUser) =>
  MockRemotePeer.create(
    remoteUser,
    MockRtcPeerConnection.create(),
    MockMediaStream.create(),
    MockRtcDataChannel.create()
  );

const getTestRemotePeerWithRtcPeerconnection = (
  rtcPeerConnection: RTCPeerConnection
) =>
  MockRemotePeer.create(
    RemoteUser.create("user-1", "Jane Doe"),
    rtcPeerConnection,
    MockMediaStream.create(),
    MockRtcDataChannel.create()
  );

describe("Conference", () => {
  describe("name", () => {
    // Given
    const conferenceName = "conference-awesome-name";
    const currentUser = getDefaultTestCurrentUser();
    const conference = Conference.create(conferenceName, currentUser);

    // When
    const result = conference.name();

    // Then
    expect(result).toEqual(conferenceName);
  });

  describe("addRemotePeer", () => {
    describe("when the peer is not in the conference", () => {
      it("should add the peer", () => {
        // Given
        const conference = getDefaultTestConference();
        const newRemotePeer = getDefaultTestRemotePeer();

        // When
        conference.addRemotePeer(newRemotePeer);

        // Then
        expect(conference.allRemotePeers()).toEqual([newRemotePeer]);
      });

      it("should start streaming with the peer", () => {
        // Given
        const existingVideoTrack = MockMediaStreamTrack.createAudioTrack(
          "existing-video"
        );
        const localAudioTrack = MockMediaStreamTrack.createAudioTrack(
          "local-audio"
        );
        const localVideotrack = MockMediaStreamTrack.createVideoTrack(
          "local-video"
        );
        const mediaStream = MockMediaStream.createWithTracks([
          existingVideoTrack,
          localAudioTrack,
          localVideotrack,
        ]);
        const rtcRtpSender = MockRTCRtpSender.createRTCRtpSender(
          existingVideoTrack
        );

        const currentUser = CurrentUser.create(
          "current-user",
          "current-user-token",
          "current-user-name",
          mockRtcConfiguration(),
          mediaStream
        );

        const conference = Conference.create("conference-name", currentUser);
        const rtcPeerConnection = MockRtcPeerConnection.create();

        // TODO: without mocks
        (rtcPeerConnection.getSenders as jest.Mock).mockReturnValue([
          rtcRtpSender,
        ]);

        const newRemotePeer = MockRemotePeer.create(
          RemoteUser.create("user-1", "Jane Doe"),
          rtcPeerConnection,
          MockMediaStream.create(),
          MockRtcDataChannel.create()
        );

        // When
        conference.addRemotePeer(newRemotePeer);

        // Then
        // TODO: verify using getTracks
        expect(rtcPeerConnection.addTrack).toHaveBeenCalledTimes(2);
        expect(rtcPeerConnection.addTrack).toHaveBeenCalledWith(
          localAudioTrack,
          mediaStream
        );
        expect(rtcPeerConnection.addTrack).toHaveBeenCalledWith(
          localVideotrack,
          mediaStream
        );
      });
    });

    describe("when the peer is already in the conference", () => {
      it("should not add the peer", () => {
        // Given
        const conference = getDefaultTestConference();
        const newRemotePeer = getDefaultTestRemotePeer();

        // When
        conference.addRemotePeer(newRemotePeer);
        conference.addRemotePeer(newRemotePeer);

        // Then
        expect(conference.allRemotePeers()).toEqual([newRemotePeer]);
      });
    });
  });

  describe("removeRemotePeer", () => {
    it("should remove the peer from the conference", () => {
      // Given
      const conference = getDefaultTestConference();
      const remotePeer = getDefaultTestRemotePeer();
      conference.addRemotePeer(remotePeer);

      // When
      conference.removeRemotePeer(remotePeer);

      // Then
      expect(conference.allRemotePeers()).toEqual([]);
    });
  });

  describe("removeRemoteUser", () => {
    describe("when the user is in the conference", () => {
      it("should remove the peer associated with the user", () => {
        // Given
        const conference = getDefaultTestConference();
        const remotePeer = getDefaultTestRemotePeer();
        conference.addRemotePeer(remotePeer);

        // When
        conference.removeRemoteUser(RemoteUser.create("user-1", "Jane Doe"));

        // Then
        expect(conference.allRemotePeers()).toEqual([]);
      });
    });

    describe("when the user is not in the conference", () => {
      it("should do nothing", () => {
        // Given
        const conference = getDefaultTestConference();
        const remotePeer = getDefaultTestRemotePeer();
        conference.addRemotePeer(remotePeer);

        // When
        conference.removeRemoteUser(RemoteUser.create("user-2", "Incognito"));

        // Then
        expect(conference.allRemotePeers()).toEqual([remotePeer]);
      });
    });
  });

  describe("remotePeerByUser", () => {
    it("should return the peer associated with the user", () => {
      // Given
      const conference = getDefaultTestConference();
      const remotePeer = getDefaultTestRemotePeer();
      conference.addRemotePeer(remotePeer);

      // When
      const result = conference.remotePeerByUser(
        RemoteUser.create("user-1", "Jane Doe")
      );

      // Then
      expect(result).toEqual(remotePeer);
    });
  });

  describe("userById", () => {
    describe("when the user is in the conference", () => {
      it("should return the peer", () => {
        // Given
        const conference = getDefaultTestConference();
        const remotePeer = getDefaultTestRemotePeer();
        conference.addRemotePeer(remotePeer);

        // When
        const result = conference.userById("user-1");

        // Then
        expect(result).toEqual(remotePeer);
      });
    });

    describe("when the user is not in the conference", () => {
      it("should throw an error", () => {
        // Given
        const conference = getDefaultTestConference();
        const remotePeer = getDefaultTestRemotePeer();
        conference.addRemotePeer(remotePeer);

        // When
        expect(() => {
          conference.userById("user-unknown");
        })
          // Then
          .toThrow("User not found in conference: user-unknown");
      });
    });
  });

  describe("allRemotePeers", () => {
    it("should return all the peers", () => {
      // Given
      const conference = getDefaultTestConference();
      const remotePeer1 = getTestRemotePeer(
        RemoteUser.create("user-1", "Jane Doe")
      );
      const remotePeer2 = getTestRemotePeer(
        RemoteUser.create("user-2", "Richard Richardson")
      );
      conference.addRemotePeer(remotePeer1);
      conference.addRemotePeer(remotePeer2);

      // When
      const allPeers = conference.allRemotePeers();

      // Then
      expect(allPeers).toEqual([remotePeer1, remotePeer2]);
    });
  });

  describe("startLocalAudio", () => {
    it("should set the local audio stream", () => {
      // Given
      const newAudioTracks = [
        MockMediaStreamTrack.createAudioTrack("new-audio-1"),
      ];
      const oldAudioTracks = [
        MockMediaStreamTrack.createAudioTrack("old-audio-1"),
        MockMediaStreamTrack.createAudioTrack("old-audio-2"),
      ];
      const mediaStream = MockMediaStream.createWithTracks(oldAudioTracks);
      const conference = getTestConferenceWithLocalMediaStream(mediaStream);

      // When
      conference.startLocalAudio(newAudioTracks);

      // Then
      expect(oldAudioTracks[0].stop).toHaveBeenCalled();
      expect(oldAudioTracks[1].stop).toHaveBeenCalled();

      expect(mediaStream.getAudioTracks()).toEqual(newAudioTracks);
    });

    it("should share the audio stream with all the peers", () => {
      // Given
      const localAudioTrack = MockMediaStreamTrack.createAudioTrack("audio-1");
      const localMediaStream = MockMediaStream.createWithTracks([
        localAudioTrack,
      ]);
      const conference = getTestConferenceWithLocalMediaStream(
        localMediaStream
      );
      const remotePeer1RtcConnection = MockRtcPeerConnection.create();
      const remotePeer2RtcConnection = MockRtcPeerConnection.create();

      conference.addRemotePeer(
        getTestRemotePeerWithRtcPeerconnection(remotePeer1RtcConnection)
      );
      conference.addRemotePeer(
        getTestRemotePeerWithRtcPeerconnection(remotePeer2RtcConnection)
      );

      // When
      conference.startLocalAudio([localAudioTrack]);

      // Then
      expect(remotePeer1RtcConnection.addTrack).toHaveBeenCalledWith(
        localAudioTrack,
        localMediaStream
      );

      expect(remotePeer2RtcConnection.addTrack).toHaveBeenCalledWith(
        localAudioTrack,
        localMediaStream
      );
    });
  });

  describe("stopLocalAudio", () => {
    it("should remove the local video stream", () => {
      // Given
      const audioTracks = [
        MockMediaStreamTrack.createAudioTrack("audio-1"),
        MockMediaStreamTrack.createAudioTrack("audio-2"),
      ];
      const mediaStream = MockMediaStream.createWithTracks(audioTracks);
      const conference = getTestConferenceWithLocalMediaStream(mediaStream);

      // When
      conference.stopLocalAudio();

      // Then
      expect(audioTracks[0].stop).toHaveBeenCalled();
      expect(audioTracks[1].stop).toHaveBeenCalled();

      expect(mediaStream.getAudioTracks()).toEqual([]);
    });

    it("should stop sending the video stream to other peers", () => {
      // Given
      const conference = getDefaultTestConference();
      const rtcPeerConnection1 = MockRtcPeerConnection.create();
      const rtcPeerConnection2 = MockRtcPeerConnection.create();
      const remotePeer1 = getTestRemotePeerWithRtcPeerconnection(
        rtcPeerConnection1
      );
      const remotePeer2 = getTestRemotePeerWithRtcPeerconnection(
        rtcPeerConnection2
      );
      const senderRemotePeer1 = MockRTCRtpSender.createRTCRtpSender(
        MockMediaStreamTrack.createAudioTrack("audio-1")
      );
      const senderRemotePeer2 = MockRTCRtpSender.createRTCRtpSender(
        MockMediaStreamTrack.createAudioTrack("audio-2")
      );
      (rtcPeerConnection1.getSenders as jest.Mock).mockReturnValue([
        senderRemotePeer1,
      ]);
      (rtcPeerConnection2.getSenders as jest.Mock).mockReturnValue([
        senderRemotePeer2,
      ]);

      conference.addRemotePeer(remotePeer1);
      conference.addRemotePeer(remotePeer2);

      // When
      conference.stopLocalAudio();

      // Then
      expect(rtcPeerConnection1.removeTrack).toHaveBeenCalledWith(
        senderRemotePeer1
      );
      expect(rtcPeerConnection2.removeTrack).toHaveBeenCalledWith(
        senderRemotePeer2
      );
    });
  });

  describe("startLocalVideo", () => {
    it("should set the local video stream", () => {
      // Given
      const newVideoTracks = [
        MockMediaStreamTrack.createVideoTrack("new-video-1"),
      ];
      const oldVideoTracks = [
        MockMediaStreamTrack.createVideoTrack("old-video-1"),
        MockMediaStreamTrack.createVideoTrack("old-video-2"),
      ];
      const mediaStream = MockMediaStream.createWithTracks(oldVideoTracks);
      const conference = getTestConferenceWithLocalMediaStream(mediaStream);

      // When
      conference.startLocalVideo(newVideoTracks);

      // Then
      expect(oldVideoTracks[0].stop).toHaveBeenCalled();
      expect(oldVideoTracks[1].stop).toHaveBeenCalled();

      expect(mediaStream.getVideoTracks()).toEqual(newVideoTracks);
    });

    it("should share the video stream with all the peers", () => {
      // Given
      const localVideoTrack = MockMediaStreamTrack.createVideoTrack("video-1");
      const localMediaStream = MockMediaStream.createWithTracks([
        localVideoTrack,
      ]);
      const conference = getTestConferenceWithLocalMediaStream(
        localMediaStream
      );
      const remotePeer1RtcConnection = MockRtcPeerConnection.create();
      const remotePeer2RtcConnection = MockRtcPeerConnection.create();

      conference.addRemotePeer(
        getTestRemotePeerWithRtcPeerconnection(remotePeer1RtcConnection)
      );
      conference.addRemotePeer(
        getTestRemotePeerWithRtcPeerconnection(remotePeer2RtcConnection)
      );

      // When
      conference.startLocalVideo([localVideoTrack]);

      // Then
      expect(remotePeer1RtcConnection.addTrack).toHaveBeenCalledWith(
        localVideoTrack,
        localMediaStream
      );

      expect(remotePeer2RtcConnection.addTrack).toHaveBeenCalledWith(
        localVideoTrack,
        localMediaStream
      );
    });
  });

  describe("stopLocalVideo", () => {
    it("should remove the local video stream", () => {
      // Given
      const videoTracks = [
        MockMediaStreamTrack.createVideoTrack("video-1"),
        MockMediaStreamTrack.createVideoTrack("video-2"),
      ];
      const mediaStream = MockMediaStream.createWithTracks(videoTracks);
      const conference = getTestConferenceWithLocalMediaStream(mediaStream);

      // When
      conference.stopLocalVideo();

      // Then
      expect(videoTracks[0].stop).toHaveBeenCalled();
      expect(videoTracks[1].stop).toHaveBeenCalled();

      expect(mediaStream.getVideoTracks()).toEqual([]);
    });

    it("should stop sending the video stream to other peers", () => {
      // Given
      const conference = getDefaultTestConference();
      const rtcPeerConnection1 = MockRtcPeerConnection.create();
      const rtcPeerConnection2 = MockRtcPeerConnection.create();
      const remotePeer1 = getTestRemotePeerWithRtcPeerconnection(
        rtcPeerConnection1
      );
      const remotePeer2 = getTestRemotePeerWithRtcPeerconnection(
        rtcPeerConnection2
      );
      const senderRemotePeer1 = MockRTCRtpSender.createRTCRtpSender(
        MockMediaStreamTrack.createVideoTrack("video-1")
      );
      const senderRemotePeer2 = MockRTCRtpSender.createRTCRtpSender(
        MockMediaStreamTrack.createVideoTrack("video-2")
      );

      // TODO: should not be mocked
      (rtcPeerConnection1.getSenders as jest.Mock).mockReturnValue([
        senderRemotePeer1,
      ]);
      (rtcPeerConnection2.getSenders as jest.Mock).mockReturnValue([
        senderRemotePeer2,
      ]);

      conference.addRemotePeer(remotePeer1);
      conference.addRemotePeer(remotePeer2);

      // When
      conference.stopLocalVideo();

      // Then
      // TODO: verify using getTracks
      expect(rtcPeerConnection1.removeTrack).toHaveBeenCalledWith(
        senderRemotePeer1
      );
      expect(rtcPeerConnection2.removeTrack).toHaveBeenCalledWith(
        senderRemotePeer2
      );
    });
  });

  describe("sendMessage", () => {
    it("should add the message to the messages queue", () => {
      // Given
      const message = "This is a test message";
      const conference = getDefaultTestConference();
      const localUser = conference.localUser();

      // When
      conference.sendMessage(message);

      // Then
      const messages = conference.messages();

      expect(messages.length).toBe(1);
      expect(messages[0].type()).toEqual("text");
      expect(messages[0].author()).toEqual({
        id: localUser.id(),
        name: localUser.name(),
      });
      expect(messages[0].content()).toEqual(message);
    });

    it("should send the message to all the peers", () => {
      // Given
      const message = "This is a test message";
      const conference = getDefaultTestConference();
      const remotePeer1 = getTestRemotePeer(
        RemoteUser.create("user-1", "Jane Doe")
      );
      const remotePeer2 = getTestRemotePeer(
        RemoteUser.create("user-é", "Richard Richardson")
      );
      conference.addRemotePeer(remotePeer1);
      conference.addRemotePeer(remotePeer2);

      // When
      conference.sendMessage(message);

      // Then
      expect(remotePeer1.dataChannel()!.send).toHaveBeenCalledTimes(2);
      expect(remotePeer1.dataChannel()!.send).toHaveBeenNthCalledWith(
        1,
        "start:text:1"
      );
      expect(remotePeer1.dataChannel()!.send).toHaveBeenNthCalledWith(
        2,
        "This is a test message"
      );

      expect(remotePeer2.dataChannel()!.send).toHaveBeenCalledTimes(2);
      expect(remotePeer2.dataChannel()!.send).toHaveBeenNthCalledWith(
        1,
        "start:text:1"
      );
      expect(remotePeer2.dataChannel()!.send).toHaveBeenNthCalledWith(
        2,
        "This is a test message"
      );
    });

    it("should split large messages into chunks of 8k", () => {
      // Given
      const message =
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
      const conference = getDefaultTestConference();
      const remotePeer1 = getTestRemotePeer(
        RemoteUser.create("user-1", "Jane Doe")
      );
      const remotePeer2 = getTestRemotePeer(
        RemoteUser.create("user-é", "Richard Richardson")
      );
      conference.addRemotePeer(remotePeer1);
      conference.addRemotePeer(remotePeer2);

      // When
      conference.sendMessage(message);

      // Then
      // expect(remotePeer1.dataChannel()!.send).toHaveBeenCalledTimes(3);
      expect(remotePeer1.dataChannel()!.send).toHaveBeenNthCalledWith(
        1,
        "start:text:2"
      );
      expect(remotePeer1.dataChannel()!.send).toHaveBeenNthCalledWith(
        2,
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      );
      expect(remotePeer1.dataChannel()!.send).toHaveBeenNthCalledWith(
        3,
        "aaaaa"
      );
    });
  });

  describe("sendImage", () => {
    it("should add the message to the messages queue", () => {
      // Given
      const message = "data:image/png;base64,iVBORw0KGgoA";
      const conference = getDefaultTestConference();
      const localUser = conference.localUser();

      // When
      conference.sendImage(message);

      // Then
      const messages = conference.messages();

      expect(messages.length).toBe(1);
      expect(messages[0].type()).toEqual("image");
      expect(messages[0].author()).toEqual({
        id: localUser.id(),
        name: localUser.name(),
      });
      expect(messages[0].content()).toEqual(message);
    });

    it("should send the message to all the peers", () => {
      // Given
      const message = "data:image/png;base64,iVBORw0KGgoA";
      const conference = getDefaultTestConference();
      const remotePeer1 = getTestRemotePeer(
        RemoteUser.create("user-1", "Jane Doe")
      );
      const remotePeer2 = getTestRemotePeer(
        RemoteUser.create("user-é", "Richard Richardson")
      );
      conference.addRemotePeer(remotePeer1);
      conference.addRemotePeer(remotePeer2);

      // When
      conference.sendImage(message);

      // Then
      expect(remotePeer1.dataChannel()!.send).toHaveBeenCalledTimes(2);
      expect(remotePeer1.dataChannel()!.send).toHaveBeenNthCalledWith(
        1,
        "start:image:1"
      );
      expect(remotePeer1.dataChannel()!.send).toHaveBeenNthCalledWith(
        2,
        "data:image/png;base64,iVBORw0KGgoA"
      );

      expect(remotePeer2.dataChannel()!.send).toHaveBeenCalledTimes(2);
      expect(remotePeer2.dataChannel()!.send).toHaveBeenNthCalledWith(
        1,
        "start:image:1"
      );
      expect(remotePeer2.dataChannel()!.send).toHaveBeenNthCalledWith(
        2,
        "data:image/png;base64,iVBORw0KGgoA"
      );
    });
  });

  describe("addMessage", () => {
    it("should add the message to the messages queue", () => {
      // Given
      const author: Author = {
        name: "Jane Doe",
        id: "user-1",
      };
      const message1 = Message.createTextMessage(author, "Hey there");
      const message2 = Message.createTextMessage(author, "What's up?");
      const conference = getDefaultTestConference();

      // When
      conference.addMessage(message1);
      conference.addMessage(message2);

      // Then
      expect(conference.messages()).toEqual([message1, message2]);
    });
  });

  describe("leave", () => {
    it("should stop the audio stream", () => {
      // Given
      const audioTracks = [
        MockMediaStreamTrack.createAudioTrack("audio-1"),
        MockMediaStreamTrack.createAudioTrack("audio-2"),
      ];
      const mediaStream = MockMediaStream.createWithTracks(audioTracks);
      const conference = getTestConferenceWithLocalMediaStream(mediaStream);

      // When
      conference.leave();

      // Then
      expect(audioTracks[0].stop).toHaveBeenCalled();
      expect(audioTracks[1].stop).toHaveBeenCalled();

      expect(mediaStream.getAudioTracks()).toEqual([]);
    });

    it("should stop the video stream", () => {
      // Given
      const videoTracks = [
        MockMediaStreamTrack.createVideoTrack("video-1"),
        MockMediaStreamTrack.createVideoTrack("video-2"),
      ];
      const mediaStream = MockMediaStream.createWithTracks(videoTracks);
      const conference = getTestConferenceWithLocalMediaStream(mediaStream);

      // When
      conference.leave();

      // Then
      expect(videoTracks[0].stop).toHaveBeenCalled();
      expect(videoTracks[1].stop).toHaveBeenCalled();

      expect(mediaStream.getVideoTracks()).toEqual([]);
    });

    it("should close the connection to each peer", () => {
      // Given
      const conference = getDefaultTestConference();
      const rtcPeerConnection1 = MockRtcPeerConnection.create();
      const rtcPeerConnection2 = MockRtcPeerConnection.create();
      const rtcRtpSender1 = MockRTCRtpSender.createRTCRtpSender(
        MockMediaStreamTrack.createVideoTrack("video-track")
      );
      const rtcRtpSender2 = MockRTCRtpSender.createRTCRtpSender(
        MockMediaStreamTrack.createAudioTrack("audio-track")
      );

      // TODO: should not be mocked
      (rtcPeerConnection1.getSenders as jest.Mock).mockReturnValue([
        rtcRtpSender1,
      ]);
      (rtcPeerConnection2.getSenders as jest.Mock).mockReturnValue([
        rtcRtpSender2,
      ]);

      conference.addRemotePeer(
        getTestRemotePeerWithRtcPeerconnection(rtcPeerConnection1)
      );
      conference.addRemotePeer(
        getTestRemotePeerWithRtcPeerconnection(rtcPeerConnection2)
      );

      // When
      conference.leave();

      // Then
      expect(rtcPeerConnection1.removeTrack).toHaveBeenCalledWith(
        rtcRtpSender1
      );
      expect(rtcPeerConnection2.removeTrack).toHaveBeenCalledWith(
        rtcRtpSender2
      );
    });
  });
});
