import React, { useEffect, useRef } from "react";
import { useMutation, useSubscription } from "urql";
import { loader } from "graphql.macro";
import debug from "debug";

const SPACE_JOINED = loader("./SpaceJoined.graphql");
const SPACE_LEFT = loader("./SpaceLeft.graphql");
const RTC_OFFER_RECEIVED = loader("./RtcOfferReceived.graphql");
const RTC_ANSWER_RECEIVED = loader("./RtcAnswerReceived.graphql");
const RTC_ICE_CANDIDATE_RECEIVED = loader("./RtcIceCandidateReceived.graphql");
const SEND_RTC_OFFER = loader("./SendRtcOffer.graphql");
const SEND_RTC_ANSWER = loader("./SendRtcAnswer.graphql");
const SEND_RTC_ICE_CANDIDATE = loader("./SendRtcIceCandidate.graphql");
const JOIN_SPACE = loader("./JoinSpace.graphql");
const LEAVE_SPACE = loader("./LeaveSpace.graphql");

export interface SpaceProps {
  userId: string;
  slug: string;
}

interface SpaceJoinedEvent {
  spaceJoined: {
    user: {
      id: string;
    };
  };
}

interface SpaceLeftEvent {
  spaceLeft: {
    user: {
      id: string;
    };
  };
}

interface RtcOfferReceivedEvent {
  offerReceived: {
    offer: {
      type: RTCSdpType;
      sdp: string;
    };
    senderId: string;
  };
}

interface RtcAnswerReceivedEvent {
  answerReceived: {
    answer: {
      type: RTCSdpType;
      sdp: string;
    };
    senderId: string;
  };
}

interface RtcIceCandidateReceivedEvent {
  iceCandidateReceived: {
    iceCandidate: string;
    senderId: string;
  };
}

interface JoinSpaceVariables {
  slug: string;
}

interface LeaveSpaceVariables {
  slug: string;
}

interface SendRtcOfferVariables {
  offer: string;
  recipientId: string;
}

interface SendRtcAnswerVariables {
  answer: string;
  recipientId: string;
}

interface SendRtcIceCandidateVariables {
  iceCandidate: string;
  recipientId: string;
}

const peerConnectionConfiguration: RTCConfiguration = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

const logSignaling = debug("app:signaling");
const logRtc = debug("app:rtc");

export const Space: React.FC<SpaceProps> = ({ userId, slug }) => {
  const { current: peerConnections } = useRef(
    new Map<string, RTCPeerConnection>()
  );

  // Mutations setup
  const [, joinSpace] = useMutation<unknown, JoinSpaceVariables>(JOIN_SPACE);
  const [, leaveSpace] = useMutation<unknown, LeaveSpaceVariables>(LEAVE_SPACE);
  const [, sendRtcOffer] = useMutation<unknown, SendRtcOfferVariables>(
    SEND_RTC_OFFER
  );
  const [, sendRtcAnswer] = useMutation<unknown, SendRtcAnswerVariables>(
    SEND_RTC_ANSWER
  );
  const [, sendRtcIceCandidate] = useMutation<
    unknown,
    SendRtcIceCandidateVariables
  >(SEND_RTC_ICE_CANDIDATE);

  // Subscriptions setup
  useSubscription<SpaceLeftEvent, void>(
    { query: SPACE_LEFT, variables: { slug } },
    (_, { spaceLeft }) => {
      logSignaling(`User ${spaceLeft.user.id} left the space`);

      peerConnections.delete(spaceLeft.user.id);
    }
  );

  useSubscription<SpaceJoinedEvent, void>(
    { query: SPACE_JOINED, variables: { slug } },
    async (_, { spaceJoined }) => {
      logSignaling(`User ${spaceJoined.user.id} joined the space`);

      // Create the connection
      logRtc(
        `Creating a peer connection for remote user ${spaceJoined.user.id}`
      );
      const peerConnection = new RTCPeerConnection(peerConnectionConfiguration);
      peerConnections.set(spaceJoined.user.id, peerConnection);

      // Send ice candidate as they arrive
      peerConnection.onicecandidate = (e) => {
        if (!e.candidate) {
          return;
        }

        logRtc(
          `Adding an ice candidate for remote user ${spaceJoined.user.id}`
        );
        peerConnection.addIceCandidate(e.candidate);

        logRtc(`Sending an ice candiate to remote user ${spaceJoined.user.id}`);
        sendRtcIceCandidate({
          iceCandidate: e.candidate as any,
          recipientId: spaceJoined.user.id,
        });
      };

      // Create an offer
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      // Send the offer
      logRtc(`Sending an offer to remote user ${spaceJoined.user.id}`);
      sendRtcOffer({
        offer: offer.sdp!,
        recipientId: spaceJoined.user.id,
      });
    }
  );

  useSubscription<RtcOfferReceivedEvent, void>(
    { query: RTC_OFFER_RECEIVED },
    async (_, { offerReceived }) => {
      logRtc(`Received an offer from remote user ${offerReceived.senderId}`);

      // Create the connection
      logRtc(
        `Creating a peer connection for remote user ${offerReceived.senderId}`
      );
      const peerConnection = new RTCPeerConnection(peerConnectionConfiguration);
      peerConnections.set(offerReceived.senderId, peerConnection);

      // Send ice candidate as they arrive
      peerConnection.onicecandidate = (e) => {
        if (!e.candidate) {
          return;
        }

        logRtc(
          `Adding an ice candidate for remote user ${offerReceived.senderId}`
        );
        peerConnection.addIceCandidate(e.candidate);

        logRtc(
          `Sending an ice candidate to remote user ${offerReceived.senderId}`
        );
        sendRtcIceCandidate({
          iceCandidate: e.candidate as any,
          recipientId: offerReceived.senderId,
        });
      };

      // Create an answer
      await peerConnection.setRemoteDescription(offerReceived.offer);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      // Send the answer
      logRtc(`Adding an answer to remote user ${offerReceived.senderId}`);
      sendRtcAnswer({
        answer: answer.sdp!,
        recipientId: offerReceived.senderId,
      });
    }
  );

  useSubscription<RtcAnswerReceivedEvent, void>(
    { query: RTC_ANSWER_RECEIVED },
    async (_, { answerReceived }) => {
      logRtc(`Received an answer from remote user ${answerReceived.senderId}`);

      // Get the connection
      const peerConnection = peerConnections.get(answerReceived.senderId);

      if (!peerConnection) {
        return;
      }

      // Set the remote description
      logRtc(
        `Setting the remote description for remote user ${answerReceived.senderId}`
      );
      await peerConnection.setRemoteDescription(answerReceived.answer);
    }
  );

  useSubscription<RtcIceCandidateReceivedEvent, void>(
    { query: RTC_ICE_CANDIDATE_RECEIVED },
    async (_, { iceCandidateReceived }) => {
      logRtc(
        `Received an ice candidate for remote user ${iceCandidateReceived.senderId}`
      );

      // Get the connection
      const peerConnection = peerConnections.get(iceCandidateReceived.senderId);

      if (!peerConnection) {
        return;
      }

      // Set the ice candidate
      logRtc(
        `Setting an ice candidate for remote user ${iceCandidateReceived.senderId}`
      );
      await peerConnection.addIceCandidate(
        iceCandidateReceived.iceCandidate as any
      );
    }
  );

  useEffect(() => {
    joinSpace({ slug });

    return () => {
      leaveSpace({ slug });
    };
  }, [joinSpace, leaveSpace, slug]);

  return (
    <main>
      <h1>Welcome to space "{slug}"</h1>
      <p>Logged in as user {userId}</p>
    </main>
  );
};
