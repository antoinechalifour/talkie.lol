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

export interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const content = message.isImage() ? (
    <img src={message.content()} alt={`Send from ${message.author()}`} />
  ) : (
    <Linkify tagName="p" options={{ target: "_blank" }}>
      {message.content()}
    </Linkify>
  );

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
