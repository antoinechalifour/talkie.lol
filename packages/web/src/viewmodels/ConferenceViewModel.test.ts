import { MockRemotePeer } from "../test-utils/remotePeer";
import { MockRtcPeerConnection } from "../test-utils/rtcPeerConnection";
import { MockRtcDataChannel } from "../test-utils/rtcDataChannel";
import {
  MockMediaStream,
  MockMediaStreamTrack,
} from "../test-utils/mediaStream";
import { Conference } from "../models/Conference";
import { CurrentUser } from "../models/CurrentUser";
import { Message } from "../models/Message";
import { RemoteUser } from "../models/RemoteUser";
import { RemotePeer } from "../models/RemotePeer";
import { TextMessage } from "../models/TextMessage";
import { ImageMessage } from "../models/ImageMessage";
import { ConferenceViewModel } from "./ConferenceViewModel";

const getDefaultTestCurrentUser = () =>
  CurrentUser.create(
    "current-user-id",
    "current-user-token",
    "John Doe",
    { iceServers: [] },
    MockMediaStream.create()
  );

const getDefaultTestConference = () =>
  Conference.create("conference-name", getDefaultTestCurrentUser());

const getDefaultTestAuthor = () => ({
  id: "author-id-1",
  name: "Jane Doe",
});

const getTestRemotePeerWithRemoteUser = (remoteUser: RemoteUser) =>
  MockRemotePeer.create(
    remoteUser,
    MockRtcPeerConnection.create(),
    MockMediaStream.create(),
    MockRtcDataChannel.create()
  );

describe("ConferenceViewModel", () => {
  describe("name", () => {
    it("should return the conference name", () => {
      // Given
      const conference = getDefaultTestConference();
      const viewModel = ConferenceViewModel.create(conference);

      // When
      const result = viewModel.name();

      // Then
      expect(result).toEqual(conference.name());
    });
  });

  describe("localUser", () => {
    it("should return the conference local user", () => {
      // Given
      const conference = getDefaultTestConference();
      const viewModel = ConferenceViewModel.create(conference);

      // When
      const result = viewModel.localUser();

      // Then
      expect(result).toEqual(conference.localUser());
    });
  });

  describe("messages", () => {
    it("should return the conference messages", () => {
      // Given
      const conference = getDefaultTestConference();
      const viewModel = ConferenceViewModel.create(conference);
      conference.addMessage(
        TextMessage.createTextMessage(
          getDefaultTestAuthor(),
          "message 1 content"
        )
      );

      // When
      const result = viewModel.messages();

      // Then
      expect(result).toEqual(conference.messages());
    });
  });

  describe("addRemotePeer", () => {
    let remotePeer1: RemotePeer;
    let remotePeer2: RemotePeer;
    let conference: Conference;
    let viewModel: ConferenceViewModel;

    beforeEach(() => {
      // Given
      remotePeer1 = getTestRemotePeerWithRemoteUser(
        RemoteUser.create("user-1", "Jane Doe")
      );
      remotePeer2 = getTestRemotePeerWithRemoteUser(
        RemoteUser.create("user-2", "Richard Richardson")
      );
      conference = getDefaultTestConference();
      viewModel = ConferenceViewModel.create(conference);
    });

    it("should add the remote peer to the conference", () => {
      // When
      viewModel.addRemotePeer(remotePeer1);

      // Then
      expect(conference.allRemotePeers()).toEqual([remotePeer1]);
    });

    it("should notify subscribers to the RemotePeerAdded event", () => {
      // Given
      const subscriber = jest.fn();
      const unsubscribe = viewModel.onRemotePeerAdded(subscriber);

      // When
      viewModel.addRemotePeer(remotePeer1);
      unsubscribe();
      viewModel.addRemotePeer(remotePeer2);

      // Then
      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber).toHaveBeenCalledWith(remotePeer1);
    });

    it("should notify subscribers to the RemotePeersChanged event", () => {
      // Given
      const subscriber = jest.fn();
      const unsubscribe = viewModel.onRemotePeersChanged(subscriber);

      // When
      viewModel.addRemotePeer(remotePeer1);
      unsubscribe();
      viewModel.addRemotePeer(remotePeer2);

      // Then
      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber).toHaveBeenCalledWith([remotePeer1]);
    });
  });

  describe("removeRemotePeer", () => {
    let remotePeer1: RemotePeer;
    let remotePeer2: RemotePeer;
    let conference: Conference;
    let viewModel: ConferenceViewModel;

    beforeEach(() => {
      // Given
      remotePeer1 = getTestRemotePeerWithRemoteUser(
        RemoteUser.create("user-1", "Jane Doe")
      );
      remotePeer2 = getTestRemotePeerWithRemoteUser(
        RemoteUser.create("user-2", "Richard Richardson")
      );
      conference = getDefaultTestConference();
      viewModel = ConferenceViewModel.create(conference);

      viewModel.addRemotePeer(remotePeer1);
      viewModel.addRemotePeer(remotePeer2);
    });

    it("should remove the remote peer from the conference", () => {
      // When
      viewModel.removeRemotePeer(remotePeer1);

      // Then
      expect(conference.allRemotePeers()).toEqual([remotePeer2]);
    });

    it("should notify subscribers to the RemotePeerRemoved event", () => {
      // Given
      const subscriber = jest.fn();
      const unsubscribe = viewModel.onRemotePeerRemoved(subscriber);

      // When
      viewModel.removeRemotePeer(remotePeer1);
      unsubscribe();
      viewModel.removeRemotePeer(remotePeer2);

      // Then
      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber).toHaveBeenCalledWith(remotePeer1);
    });

    it("should notify subscribers to the RemotePeersChanged event", () => {
      // Given
      const subscriber = jest.fn();
      const unsubscribe = viewModel.onRemotePeersChanged(subscriber);

      // When
      viewModel.removeRemotePeer(remotePeer1);
      unsubscribe();
      viewModel.removeRemotePeer(remotePeer2);

      // Then
      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber).toHaveBeenCalledWith([remotePeer2]);
    });

    it("should not notify subscribers when the peer is not in the conference", () => {
      // Given
      const subscriberOnRemotePeerRemoved = jest.fn();
      const subscriberOnRemotePeersChanged = jest.fn();
      const remotePeer3 = getTestRemotePeerWithRemoteUser(
        RemoteUser.create("user-3", "Willy Billy")
      );

      viewModel.onRemotePeerRemoved(subscriberOnRemotePeerRemoved);
      viewModel.onRemotePeersChanged(subscriberOnRemotePeersChanged);

      // When
      viewModel.removeRemotePeer(remotePeer3);

      // Then
      expect(subscriberOnRemotePeerRemoved).not.toHaveBeenCalled();
      expect(subscriberOnRemotePeersChanged).not.toHaveBeenCalled();
    });
  });

  describe("removeRemoteUser", () => {
    let remotePeer1: RemotePeer;
    let remotePeer2: RemotePeer;
    let conference: Conference;
    let viewModel: ConferenceViewModel;

    beforeEach(() => {
      // Given
      remotePeer1 = getTestRemotePeerWithRemoteUser(
        RemoteUser.create("user-1", "Jane Doe")
      );
      remotePeer2 = getTestRemotePeerWithRemoteUser(
        RemoteUser.create("user-2", "Richard Richardson")
      );
      conference = getDefaultTestConference();
      viewModel = ConferenceViewModel.create(conference);

      viewModel.addRemotePeer(remotePeer1);
      viewModel.addRemotePeer(remotePeer2);
    });

    it("should remove the remote peer associated with the user from the conference", () => {
      // Given
      const remoteUser = RemoteUser.create(
        remotePeer2.id(),
        remotePeer2.name()
      );

      // When
      viewModel.removeRemoteUser(remoteUser);

      // Then
      expect(conference.allRemotePeers()).toEqual([remotePeer1]);
    });

    it("should notify subscribers to the RemotePeerRemoved event", () => {
      // Given
      const remoteUser1 = RemoteUser.create(
        remotePeer1.id(),
        remotePeer1.name()
      );
      const remoteUser2 = RemoteUser.create(
        remotePeer2.id(),
        remotePeer2.name()
      );
      const subscriber = jest.fn();
      const unsubscribe = viewModel.onRemotePeerRemoved(subscriber);

      // When
      viewModel.removeRemoteUser(remoteUser1);
      unsubscribe();
      viewModel.removeRemoteUser(remoteUser2);

      // Then
      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber).toHaveBeenCalledWith(remotePeer1);
    });

    it("should notify subscribers to the RemotePeersChanged event", () => {
      // Given
      const remoteUser1 = RemoteUser.create(
        remotePeer1.id(),
        remotePeer1.name()
      );
      const remoteUser2 = RemoteUser.create(
        remotePeer2.id(),
        remotePeer2.name()
      );
      const subscriber = jest.fn();
      const unsubscribe = viewModel.onRemotePeersChanged(subscriber);

      // When
      viewModel.removeRemoteUser(remoteUser1);
      unsubscribe();
      viewModel.removeRemoteUser(remoteUser2);

      // Then
      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber).toHaveBeenCalledWith([remotePeer2]);
    });

    it("should not notify subscribers when the peer is not in the conference", () => {
      // Given
      const subscriberOnRemotePeerRemoved = jest.fn();
      const subscriberOnRemotePeersChanged = jest.fn();
      const remoteUser3 = RemoteUser.create("user-3", "Willy Billy");

      viewModel.onRemotePeerRemoved(subscriberOnRemotePeerRemoved);
      viewModel.onRemotePeersChanged(subscriberOnRemotePeersChanged);

      // When
      viewModel.removeRemoteUser(remoteUser3);

      // Then
      expect(subscriberOnRemotePeerRemoved).not.toHaveBeenCalled();
      expect(subscriberOnRemotePeersChanged).not.toHaveBeenCalled();
    });
  });

  describe("startLocalAudio", () => {
    it("should start the conference local audio", () => {
      // Given
      const conference = getDefaultTestConference();
      const viewModel = ConferenceViewModel.create(conference);
      const audioTracks = [MockMediaStreamTrack.createAudioTrack("audio-1")];
      const mock = jest.spyOn(conference, "startLocalAudio");

      // When
      viewModel.startLocalAudio(audioTracks);

      // Then
      expect(mock).toHaveBeenCalledTimes(1);
      expect(mock).toHaveBeenCalledWith(audioTracks);
    });
  });

  describe("stopLocalAudio", () => {
    it("should stop the conference local audio", () => {
      // Given
      const conference = getDefaultTestConference();
      const viewModel = ConferenceViewModel.create(conference);
      const mock = jest.spyOn(conference, "stopLocalAudio");

      // When
      viewModel.stopLocalAudio();

      // Then
      expect(mock).toHaveBeenCalledTimes(1);
    });
  });

  describe("startLocalVideo", () => {
    it("should start the conference local video", () => {
      // Given
      const conference = getDefaultTestConference();
      const viewModel = ConferenceViewModel.create(conference);
      const videoTracks = [MockMediaStreamTrack.createVideoTrack("video-1")];
      const mock = jest.spyOn(conference, "startLocalVideo");

      // When
      viewModel.startLocalVideo(videoTracks);

      // Then
      expect(mock).toHaveBeenCalledTimes(1);
      expect(mock).toHaveBeenCalledWith(videoTracks);
    });
  });

  describe("stopLocalVideo", () => {
    it("should stop the conference local video", () => {
      // Given
      const conference = getDefaultTestConference();
      const viewModel = ConferenceViewModel.create(conference);
      const mock = jest.spyOn(conference, "stopLocalVideo");

      // When
      viewModel.stopLocalVideo();

      // Then
      expect(mock).toHaveBeenCalledTimes(1);
    });
  });

  describe("sendMessage", () => {
    let conference: Conference;
    let viewModel: ConferenceViewModel;
    let message: Message;
    let mockSendMessage: jest.SpyInstance;

    beforeEach(() => {
      conference = getDefaultTestConference();
      viewModel = ConferenceViewModel.create(conference);
      message = TextMessage.createTextMessage(
        getDefaultTestAuthor(),
        "hello world"
      );
      mockSendMessage = jest.spyOn(conference, "sendMessage");

      mockSendMessage.mockReturnValue(message);
    });

    it("should send the message to the conference", () => {
      // Given
      const messageContent = "Hello world";

      // When
      viewModel.sendMessage(messageContent);

      // Then
      expect(mockSendMessage).toHaveBeenCalledTimes(1);
      expect(mockSendMessage).toHaveBeenCalledWith(messageContent);
    });

    it("should return the message", () => {
      // When
      const result = viewModel.sendMessage("hello world");

      // Then
      expect(result).toEqual(message);
    });

    it("should notify subscribers to the MessageAdded event", () => {
      // Given
      const subscriber = jest.fn();
      const unsubscribe = viewModel.onMessageAdded(subscriber);

      // When
      viewModel.sendMessage("hello world");
      unsubscribe();
      viewModel.sendMessage("hello world");

      // Then
      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber).toHaveBeenCalledWith(message);
    });
  });

  describe("sendImage", () => {
    let conference: Conference;
    let viewModel: ConferenceViewModel;
    let message: Message;
    let mockSendImage: jest.SpyInstance;

    beforeEach(() => {
      conference = getDefaultTestConference();
      viewModel = ConferenceViewModel.create(conference);
      message = ImageMessage.createImageMessage(
        getDefaultTestAuthor(),
        "data:image/png;base64,iVBORw0KGgoA"
      );
      mockSendImage = jest.spyOn(conference, "sendImage");

      mockSendImage.mockReturnValue(message);
    });

    it("should send the image to the conference", () => {
      // Given
      const messageContent = "data:image/png;base64,iVBORw0KGgoA";

      // When
      viewModel.sendImage(messageContent);

      // Then
      expect(mockSendImage).toHaveBeenCalledTimes(1);
      expect(mockSendImage).toHaveBeenCalledWith(messageContent);
    });

    it("should return the message with an image", () => {
      // When
      const result = viewModel.sendImage("data:image/png;base64,iVBORw0KGgoA");

      // Then
      expect(result).toEqual(message);
    });

    it("should notify subscribers to the MessageAdded event", () => {
      // Given
      const subscriber = jest.fn();
      const unsubscribe = viewModel.onMessageAdded(subscriber);

      // When
      viewModel.sendImage("data:image/png;base64,iVBORw0KGgoA");
      unsubscribe();
      viewModel.sendImage("data:image/png;base64,iVBORw0KGgoA");

      // Then
      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber).toHaveBeenCalledWith(message);
    });
  });

  describe("addMessage", () => {
    let conference: Conference;
    let viewModel: ConferenceViewModel;

    beforeEach(() => {
      conference = getDefaultTestConference();
      viewModel = ConferenceViewModel.create(conference);
      jest.spyOn(conference, "addMessage");
    });

    it("should add the message to the conference", () => {
      // Given
      const message = TextMessage.createTextMessage(
        getDefaultTestAuthor(),
        "Hello world"
      );

      // When
      viewModel.addMessage(message);

      // Then
      expect(conference.messages()).toEqual([message]);
    });

    it("should notify subscribers to the MessageAdded event", () => {
      // Given
      const message1 = TextMessage.createTextMessage(
        getDefaultTestAuthor(),
        "Hello world"
      );
      const message2 = TextMessage.createTextMessage(
        getDefaultTestAuthor(),
        "What's up?"
      );
      const subscriber = jest.fn();
      const unsubscribe = viewModel.onMessageAdded(subscriber);

      // When
      viewModel.addMessage(message1);
      unsubscribe();
      viewModel.addMessage(message2);

      // Then
      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber).toHaveBeenCalledWith(message1);
    });
  });

  describe("userById", () => {
    it("should return the user by using its ID", () => {
      // Given
      const remotePeer1 = getTestRemotePeerWithRemoteUser(
        RemoteUser.create("user-1", "John Doe")
      );
      const remotePeer2 = getTestRemotePeerWithRemoteUser(
        RemoteUser.create("user-2", "Jane Doe")
      );
      const conference = getDefaultTestConference();
      const viewModel = ConferenceViewModel.create(conference);
      conference.addRemotePeer(remotePeer1);
      conference.addRemotePeer(remotePeer2);

      // When
      const result = viewModel.userById("user-2");

      // Then
      expect(result).toEqual(remotePeer2);
    });
  });

  describe("leave", () => {
    it("should leave the conference", () => {
      // Given
      const conference = getDefaultTestConference();
      const viewModel = ConferenceViewModel.create(conference);
      const mockLeave = jest.spyOn(conference, "leave");

      // When
      viewModel.leave();

      // Then
      expect(mockLeave).toHaveBeenCalledTimes(1);
    });
  });
});
