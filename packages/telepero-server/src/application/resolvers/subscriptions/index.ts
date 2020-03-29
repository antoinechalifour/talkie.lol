import { makeAuthenticatedSubscriptionInvoker } from "../../../di/makeAuthenticatedSubscriptionInvoker";
import { SpaceJoinedResolver } from "./SpaceJoinedResolver";
import { SpaceLeftResolver } from "./SpaceLeftResolver";
import { RtcAnswerReceivedResolver } from "./RtcAnswerReceivedResolver";
import { RtcOfferReceivedResolver } from "./RtcOfferReceivedResolver";
import { RtcIceCandidateReceivedResolver } from "./RtcIceCandidateReceivedResolver";

const spaceJoined = makeAuthenticatedSubscriptionInvoker(SpaceJoinedResolver);
const spaceLeft = makeAuthenticatedSubscriptionInvoker(SpaceLeftResolver);
const offerReceived = makeAuthenticatedSubscriptionInvoker(
  RtcOfferReceivedResolver
);
const answerReceived = makeAuthenticatedSubscriptionInvoker(
  RtcAnswerReceivedResolver
);
const iceCandidateReceived = makeAuthenticatedSubscriptionInvoker(
  RtcIceCandidateReceivedResolver
);

export const Subscription = {
  spaceJoined,
  spaceLeft,
  offerReceived,
  answerReceived,
  iceCandidateReceived,
};
