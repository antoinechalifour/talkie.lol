import { useEffect, useRef } from "react";
import { useMutation, useSubscription } from "urql";

import { RemotePeer } from "../RemotePeer";
import { useSpaceJoinedHandler } from "./useSpaceJoinedHandler";
import { useSpaceLeftHandler } from "./useSpaceLeftHandler";
import { useRtcOfferReceivedHandler } from "./useRtcOfferReceivedHandler";
import { useRtcAnswerReceivedHandler } from "./useRtcAnswerReceivedHandler";
import { useRtcIceCandidateReceivedHandler } from "./useRtcIceCandidateReceivedHandler";
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

interface UseSignalingOptions {
  spaceSlug: string;
  remotePeers: RemotePeer[];
  onRemotePeerConnected: (remotePeer: RemotePeer) => void;
  onRemotePeerDisconnected: (remotePeer: RemotePeer) => void;
}

export const useSignaling = ({
  spaceSlug,
  remotePeers,
  onRemotePeerConnected,
  onRemotePeerDisconnected,
}: UseSignalingOptions) => {
  /*
  In this hook, we are keeping track of all peer connections in a map, whose
  keys are the user ids, and whose values are the RTCPeerConnections.
  This map is persisted in a ref for the lifecycle of this hooks.
   */
  const ref = useRef(new Map<string, RemotePeer>());

  useEffect(() => {
    remotePeers.forEach((peer) => {
      if (!ref.current.get(peer.id())) {
        ref.current.set(peer.id(), peer);
      }
    });
  }, [remotePeers]);

  /*
                    WebRTC Signaling setup
  In here we are creating the handlers which will respond to the offer / answer
  mechanism (which are sent using GraphQL subscriptions)
   */
  const spaceJoinedHandler = useSpaceJoinedHandler({
    peerConnections: ref.current,
    onConnected: onRemotePeerConnected,
    onDisconnected: onRemotePeerDisconnected,
  });
  const spaceLeftHandler = useSpaceLeftHandler({
    peerConnections: ref.current,
  });

  const rtcOfferReceivedHandler = useRtcOfferReceivedHandler({
    peerConnections: ref.current,
    onConnected: onRemotePeerConnected,
    onDisconnected: onRemotePeerDisconnected,
  });
  const rtcAnswerReceivedHandler = useRtcAnswerReceivedHandler({
    peerConnections: ref.current,
  });
  const rtcIceCandidateReceivedHandler = useRtcIceCandidateReceivedHandler({
    peerConnections: ref.current,
  });

  /*
                    GraphQL boilerplate
  Nothing very interesting in here. Just creating mutation and subscriptions
   */
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
};
