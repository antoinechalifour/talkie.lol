import React, { useEffect, useRef } from "react";
import Linkify from "linkifyjs/react";

import { Message } from "../../../../models/Message";
import {
  AuthorName,
  MessageContent,
  ReceivedTime,
  MessagesList,
  MessageLayout,
} from "./styles";

export interface ChatMessagesProps {
  messages: Message[];
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!listRef.current) return;

    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  return (
    <MessagesList ref={listRef}>
      {messages.map((message) => (
        <MessageLayout key={message.id()}>
          <AuthorName>{message.author().name}</AuthorName>
          <MessageContent>
            <Linkify tagName="span" options={{ target: "_blank" }}>
              {message.content()}
            </Linkify>
          </MessageContent>
          <ReceivedTime>{message.receivedTime()}</ReceivedTime>
        </MessageLayout>
      ))}
    </MessagesList>
  );
};
