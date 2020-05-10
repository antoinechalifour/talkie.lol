import React, { useCallback } from "react";
import Linkify from "linkifyjs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import Tooltip from "@reach/tooltip";

import { Message } from "../../../../models/Message";
import { ImageMessage } from "../../../../models/ImageMessage";
import { TextMessage } from "../../../../models/TextMessage";
import { FilePreviewMessage } from "../../../../models/FilePreviewMessage";
import {
  AuthorName,
  MessageContent,
  MessageLayout,
  ReceivedTime,
  FilePreview,
  tooltipStyle,
} from "./styles";
import { messageAnimation } from "./animations";
import { useConference } from "../../hooks/useConference";

export interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const conference = useConference();
  let content: JSX.Element;

  const handleDownload = useCallback(() => {
    if (!(message instanceof FilePreviewMessage)) return;

    const peerId = message.author().id;
    const fileId = message.preview().fileId;

    conference.requestFileDownload(peerId, fileId);
  }, [conference, message]);

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
  } else if (message instanceof FilePreviewMessage) {
    const preview = message.preview();

    content = (
      <FilePreview onClick={handleDownload}>
        <Tooltip label="Download file" style={tooltipStyle}>
          <span>
            <FontAwesomeIcon icon={faFile} />
            <p>{preview.fileName}</p>
          </span>
        </Tooltip>
      </FilePreview>
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
