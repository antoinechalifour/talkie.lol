import React from "react";
import Linkify from "linkifyjs/react";

import { Message } from "../../../../models/Message";
import {
  AuthorName,
  MessageContent,
  MessageLayout,
  ReceivedTime,
} from "./styles";

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
    <MessageLayout>
      <AuthorName>{message.author().name}</AuthorName>
      <MessageContent>{content}</MessageContent>
      <ReceivedTime>{message.receivedTime()}</ReceivedTime>
    </MessageLayout>
  );
};
