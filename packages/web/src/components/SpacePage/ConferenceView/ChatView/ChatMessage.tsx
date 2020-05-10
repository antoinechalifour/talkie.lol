import React from "react";
import Linkify from "linkifyjs/react";

import { Message } from "../../../../models/Message";
import {
  AuthorName,
  MessageContent,
  MessageLayout,
  ReceivedTime,
} from "./styles";
import { messageAnimation } from "./animations";
import { ImageMessage } from "../../../../models/ImageMessage";
import { TextMessage } from "../../../../models/TextMessage";

export interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  let content: JSX.Element;

  if (message instanceof ImageMessage) {
    content = (
      <img src={message.source()} alt={`Send from ${message.author()}`} />
    );
  } else if (message instanceof TextMessage) {
    content = (
      <Linkify tagName="p" options={{ target: "_blank" }}>
        {message.content()}
      </Linkify>
    );
  } else {
    throw new Error("Invalid message type");
  }

  return (
    <MessageLayout
      variants={messageAnimation.variants}
      initial="entering"
      animate="entered"
    >
      <AuthorName>{message.author().name}</AuthorName>
      <ReceivedTime>{message.receivedTime()}</ReceivedTime>
      <MessageContent>{content}</MessageContent>
    </MessageLayout>
  );
};
