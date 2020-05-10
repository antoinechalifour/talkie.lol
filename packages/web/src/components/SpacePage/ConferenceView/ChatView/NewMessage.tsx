import React, { useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import { getImageFromClipboard } from "../../../../utils/clipboard";
import { useConference } from "../../hooks/useConference";
import { InputGroup } from "./styles";

export const NewMessage: React.FC = () => {
  const conference = useConference();
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
  );
};
