import React, { useEffect, useRef } from "react";

import { Message } from "../../../../models/Message";
import { MessagesList } from "./styles";
import { ChatMessage } from "./ChatMessage";

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
        <ChatMessage key={message.id()} message={message} />
      ))}
    </MessagesList>
  );
};
