import React, { useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentAlt, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import { useConference } from "../../hooks/useConference";
import { useMessages } from "../../hooks/useMessages";
import { ChatMessages } from "./ChatMessages";
import {
  ChatLayout,
  InputGroup,
  MessagesArea,
  NewMessageArea,
  NoMessageArea,
} from "./styles";

export interface ChatViewProps {}

export const ChatView: React.FC<ChatViewProps> = () => {
  const conference = useConference();
  const allMessages = useMessages();
  const [message, setMessage] = useState("");

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      conference.sendMessage(message);
      setMessage("");
    },
    [conference, message]
  );

  return (
    <ChatLayout>
      <MessagesArea>
        {allMessages.length === 0 ? (
          <NoMessageArea>
            <FontAwesomeIcon icon={faCommentAlt} />
            <p>No new message</p>
          </NoMessageArea>
        ) : (
          <ChatMessages messages={allMessages} />
        )}
      </MessagesArea>

      <NewMessageArea>
        <form onSubmit={onSubmit}>
          <InputGroup>
            <input
              type="text"
              placeholder="Type something..."
              aria-label="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button type="submit" aria-label="Send the message">
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </InputGroup>
        </form>
      </NewMessageArea>
    </ChatLayout>
  );
};
