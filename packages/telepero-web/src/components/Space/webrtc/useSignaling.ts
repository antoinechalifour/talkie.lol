import { useCallback, useEffect, useRef } from "react";
import { useSpaceJoinedHandler } from "./useSpaceJoinedHandler";
import { useSpaceLeftHandler } from "./useSpaceLeftHandler";
import { useRtcOfferReceivedHandler } from "./useRtcOfferReceivedHandler";
import { useRtcAnswerReceivedHandler } from "./useRtcAnswerReceivedHandler";
import { useRtcIceCandidateReceivedHandler } from "./useRtcIceCandidateReceivedHandler";
import { useMutation, useSubscription } from "urql";
import {
  JOIN_SPACE,
  JoinSpaceVariables,
  LEAVE_SPACE,
  LeaveSpaceVariables,
  RTC_ANSWER_RECEIVED,
  RTC_ICE_CANDIDATE_RECEIVED,
  RTC_OFFER_RECEIVED,
  RtcAnswerReceivedEvent,
  RtcIceCandidateReceivedEvent,
  RtcOfferReceivedEvent,
  SPACE_JOINED,
  SPACE_LEFT,
  SpaceJoinedEvent,
  SpaceLeftEvent,
} from "./signaling";
import { logRtc } from "./log";
import { OnConnectedEvent, OnDisconnectedEvent, User } from "./types";

interface UseSignalingOptions {
  userMedia: MediaStream | null;
  spaceSlug: string;
  setRemoteMediaForUser: (user: User, mediaStream: MediaStream | null) => void;
}

export const useSignaling = ({
  userMedia,
  spaceSlug,
  setRemoteMediaForUser,
}: UseSignalingOptions) => {
  const { current: peerConnections } = useRef(
    new Map<string, RTCPeerConnection>()
  );

  // @ts-ignore
  window.DEBUG = () => console.log(peerConnections.entries());

  const onConnected = useCallback(
    (e: OnConnectedEvent) => {
      setRemoteMediaForUser(e.user, e.mediaStream);
    },
    [setRemoteMediaForUser]
  );

  const onDisconnected = useCallback(
    (e: OnDisconnectedEvent) => {
      setRemoteMediaForUser(e.user, null);
    },
    [setRemoteMediaForUser]
  );

  const spaceJoinedHandler = useSpaceJoinedHandler({
    userMedia,
    peerConnections,
    onConnected,
    onDisconnected,
  });
  const spaceLeftHandler = useSpaceLeftHandler({ peerConnections });
  const rtcOfferReceivedHandler = useRtcOfferReceivedHandler({
    peerConnections,
    userMedia,
    onConnected,
    onDisconnected,
  });
  const rtcAnswerReceivedHandler = useRtcAnswerReceivedHandler({
    peerConnections,
  });
  const rtcIceCandidateReceivedHandler = useRtcIceCandidateReceivedHandler({
    peerConnections,
  });

  // Mutations setup
  const [, joinSpace] = useMutation<unknown, JoinSpaceVariables>(JOIN_SPACE);
  const [, leaveSpace] = useMutation<unknown, LeaveSpaceVariables>(LEAVE_SPACE);

  // Subscriptions setup
  useSubscription<SpaceLeftEvent, void>(
    { query: SPACE_LEFT, variables: { slug: spaceSlug } },
    (_, { spaceLeft }) => spaceLeftHandler(spaceLeft.user.id)
  );

  useSubscription<SpaceJoinedEvent, void>(
    { query: SPACE_JOINED, variables: { slug: spaceSlug } },
    async (_, { spaceJoined }) => spaceJoinedHandler(spaceJoined.user)
  );

  useSubscription<RtcOfferReceivedEvent, void>(
    { query: RTC_OFFER_RECEIVED },
    (_, { offerReceived }) =>
      rtcOfferReceivedHandler(offerReceived.sender, offerReceived.offer)
  );

  useSubscription<RtcAnswerReceivedEvent, void>(
    { query: RTC_ANSWER_RECEIVED },
    (_, { answerReceived }) =>
      rtcAnswerReceivedHandler(answerReceived.sender.id, answerReceived.answer)
  );

  useSubscription<RtcIceCandidateReceivedEvent, void>(
    { query: RTC_ICE_CANDIDATE_RECEIVED },
    (_, { iceCandidateReceived }) =>
      rtcIceCandidateReceivedHandler(
        iceCandidateReceived.sender.id,
        iceCandidateReceived.iceCandidate
      )
  );

  useEffect(() => {
    joinSpace({ slug: spaceSlug });

    return () => {
      leaveSpace({ slug: spaceSlug });
    };
  }, [joinSpace, leaveSpace, spaceSlug]);

  const sendLocalMedia = useCallback(
    (mediaStream: MediaStream) => {
      peerConnections.forEach((peerConnection) => {
        mediaStream.getTracks().forEach((track) => {
          logRtc(
            `🛫 Adding track ${track.id} / ${track.kind} to peerconnection`
          );

          peerConnection.addTrack(track, mediaStream);
        });
      });
    },
    [peerConnections]
  );

  const cancelLocalMedia = useCallback(() => {
    peerConnections.forEach((peerConnection) => {
      peerConnection.getSenders().forEach((sender) => {
        logRtc("🛫 Removing track");
        peerConnection.removeTrack(sender);
      });
    });
  }, [peerConnections]);

  return {
    sendLocalMedia,
    cancelLocalMedia,
  };
};
