import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentAlt, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import { ChatLayout, InputGroup, MessagesArea, NewMessageArea } from "./styles";

export interface ChatViewProps {}

export const ChatView: React.FC<ChatViewProps> = () => (
  <ChatLayout>
    <MessagesArea>
      <FontAwesomeIcon icon={faCommentAlt} />
      <p>No new message</p>
    </MessagesArea>

    <NewMessageArea>
      <form>
        <InputGroup>
          <input
            type="text"
            placeholder="Type something..."
            aria-label="Type a message"
            disabled
          />

          <button type="submit" aria-label="Send the message">
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </InputGroup>
      </form>
    </NewMessageArea>
  </ChatLayout>
);
