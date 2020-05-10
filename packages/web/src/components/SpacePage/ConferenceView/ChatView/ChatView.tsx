import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentAlt } from "@fortawesome/free-solid-svg-icons";

import { useNewMessageNotification } from "../../hooks/useNewMessageNotification";
import { useMessages } from "../../hooks/useMessages";
import { ChatMessages } from "./ChatMessages";
import {
  ChatLayout,
  MessagesArea,
  NewMessageArea,
  NoMessageArea,
} from "./styles";
import { NewMessage } from "./NewMessage";

export interface ChatViewProps {}

export const ChatView: React.FC<ChatViewProps> = () => {
  useNewMessageNotification();

  const allMessages = useMessages();

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
        <NewMessage />
      </NewMessageArea>
    </ChatLayout>
  );
};
