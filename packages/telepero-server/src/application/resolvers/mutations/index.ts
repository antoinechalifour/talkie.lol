import { makeAuthenticatedMutationInvoker } from "../../../di/makeAuthenticatedMutationInvoker";
import { makeMutationInvoker } from "../../../di/makeMutationInvoker";
import { CreateSpaceResolver } from "./CreateSpaceResolver";
import { JoinSpaceResolver } from "./JoinSpaceResolver";
import { LeaveSpaceResolver } from "./LeaveSpaceResolver";
import { SendRtcOfferResolver } from "./SendRtcOfferResolver";
import { SendRtcAnswerResolver } from "./SendRtcAnswerResolver";
import { SendRtcIceCandidateResolver } from "./SendRtcIceCandidateResolver";
import { LoginResolver } from "./LoginResolver";

const login = makeMutationInvoker(LoginResolver);
const createSpace = makeMutationInvoker(CreateSpaceResolver);
const joinSpace = makeAuthenticatedMutationInvoker(JoinSpaceResolver);
const leaveSpace = makeAuthenticatedMutationInvoker(LeaveSpaceResolver);
const sendRtcOffer = makeAuthenticatedMutationInvoker(SendRtcOfferResolver);
const sendRtcAnswer = makeAuthenticatedMutationInvoker(SendRtcAnswerResolver);
const sendRtcIceCandidate = makeAuthenticatedMutationInvoker(
  SendRtcIceCandidateResolver
);

export const Mutation = {
  login,
  createSpace,
  joinSpace,
  leaveSpace,
  sendRtcOffer,
  sendRtcAnswer,
  sendRtcIceCandidate,
};
