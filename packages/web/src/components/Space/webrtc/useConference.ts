import { useEffect } from "react";
import { useMutation, useSubscription } from "urql";

import { Conference } from "../models/Conference";
import { useSpaceJoinedHandler } from "./useSpaceJoinedHandler";
import { useSpaceLeftHandler } from "./useSpaceLeftHandler";
import { useRtcOfferReceivedHandler } from "./useRtcOfferReceivedHandler";
import { useRtcAnswerReceivedHandler } from "./useRtcAnswerReceivedHandler";
import { useRtcIceCandidateReceivedHandler } from "./useRtcIceCandidateReceivedHandler";
import {
  JOIN_SPACE,
  LEAVE_SPACE,
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

export const useConference = (conference: Conference) => {
  /*
                    WebRTC Signaling setup
  In here we are creating the handlers which will respond to the offer / answer
  mechanism (which are sent using GraphQL subscriptions)
   */
  const spaceJoinedHandler = useSpaceJoinedHandler(conference);
  const spaceLeftHandler = useSpaceLeftHandler(conference);
  const rtcOfferReceivedHandler = useRtcOfferReceivedHandler(conference);
  const rtcAnswerReceivedHandler = useRtcAnswerReceivedHandler(conference);
  const rtcIceCandidateReceivedHandler = useRtcIceCandidateReceivedHandler(
    conference
  );

  /*
                    GraphQL boilerplate
  Nothing very interesting in here. Just creating mutation and subscriptions
   */
  const [, joinSpace] = useMutation<unknown, {}>(JOIN_SPACE);
  const [, leaveSpace] = useMutation<unknown, {}>(LEAVE_SPACE);

  // Subscriptions setup
  useSubscription<SpaceLeftEvent, void>(
    { query: SPACE_LEFT, variables: { slug: conference.name() } },
    (_, { spaceLeft }) => spaceLeftHandler(spaceLeft.user)
  );

  useSubscription<SpaceJoinedEvent, void>(
    { query: SPACE_JOINED, variables: { slug: conference.name() } },
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
      rtcAnswerReceivedHandler(answerReceived.sender, answerReceived.answer)
  );

  useSubscription<RtcIceCandidateReceivedEvent, void>(
    { query: RTC_ICE_CANDIDATE_RECEIVED },
    (_, { iceCandidateReceived }) =>
      rtcIceCandidateReceivedHandler(
        iceCandidateReceived.sender,
        iceCandidateReceived.iceCandidate
      )
  );

  useEffect(() => {
    joinSpace();

    return () => {
      leaveSpace();
    };
  }, [joinSpace, leaveSpace]);
};
