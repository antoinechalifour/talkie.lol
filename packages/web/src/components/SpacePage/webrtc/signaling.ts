import { loader } from "graphql.macro";
import debug from "debug";

export const SPACE_JOINED = loader("./graphql/SpaceJoined.graphql");
export const SPACE_LEFT = loader("./graphql/SpaceLeft.graphql");
export const RTC_OFFER_RECEIVED = loader("./graphql/RtcOfferReceived.graphql");
export const RTC_ANSWER_RECEIVED = loader(
  "./graphql/RtcAnswerReceived.graphql"
);
export const RTC_ICE_CANDIDATE_RECEIVED = loader(
  "./graphql/RtcIceCandidateReceived.graphql"
);
export const SEND_RTC_OFFER = loader("./graphql/SendRtcOffer.graphql");
export const SEND_RTC_ANSWER = loader("./graphql/SendRtcAnswer.graphql");
export const SEND_RTC_ICE_CANDIDATE = loader(
  "./graphql/SendRtcIceCandidate.graphql"
);
export const JOIN_SPACE = loader("./graphql/JoinSpace.graphql");
export const LEAVE_SPACE = loader("./graphql/LeaveSpace.graphql");

export interface SpaceJoinedEvent {
  spaceJoined: {
    user: {
      id: string;
      name: string;
    };
  };
}

export interface SpaceLeftEvent {
  spaceLeft: {
    user: {
      id: string;
      name: string;
    };
  };
}

export interface RtcOfferReceivedEvent {
  offerReceived: {
    offer: {
      type: RTCSdpType;
      sdp: string;
    };
    sender: {
      id: string;
      name: string;
    };
  };
}

export interface RtcAnswerReceivedEvent {
  answerReceived: {
    answer: {
      type: RTCSdpType;
      sdp: string;
    };
    sender: {
      id: string;
      name: string;
    };
  };
}

export interface RtcIceCandidateReceivedEvent {
  iceCandidateReceived: {
    iceCandidate: {
      candidate: string;
      sdpMid: string;
      sdpMLineIndex: number;
    };
    sender: {
      id: string;
      name: string;
    };
  };
}

export interface SendRtcOfferVariables {
  offer: string;
  recipientId: string;
}

export interface SendRtcAnswerVariables {
  answer: string;
  recipientId: string;
}

export interface SendRtcIceCandidateVariables {
  candidate: string;
  sdpMid: string;
  sdpMLineIndex: number;
  recipientId: string;
}

export const logSignaling = debug("app:signaling 🚨");
