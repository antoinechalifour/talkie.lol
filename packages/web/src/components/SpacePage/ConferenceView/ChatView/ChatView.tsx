import React, { useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentAlt, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import { getImageFromClipboard } from "../../../../utils/clipboard";
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

  const onPaste = useCallback(
    async (e: React.ClipboardEvent<HTMLInputElement>) => {
      const image = await getImageFromClipboard(e.clipboardData.items);

      if (!image) return;

      conference.sendImage(image);
    },
    [conference]
  );

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
              onPaste={onPaste}
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
