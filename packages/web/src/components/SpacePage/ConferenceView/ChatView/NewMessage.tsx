import React, { useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import { getImageFromClipboard } from "../../../../utils/clipboard";
import { useConference } from "../../hooks/useConference";
import { InputGroup } from "./styles";

export const NewMessage: React.FC = () => {
  const conference = useConference();
  const [message, setMessage] = useState("");

  const handlePaste = useCallback(
    async (e: React.ClipboardEvent<HTMLInputElement>) => {
      const image = await getImageFromClipboard(e.clipboardData.items);

      if (!image) return;

      conference.sendImage(image);
    },
    [conference]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      conference.sendMessage(message);
      setMessage("");
    },
    [conference, message]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    return false;
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();

    const files = e.dataTransfer.files;

    for (const file of Array.from(files)) {
      conference.makeFileAvailable(file);
    }

    return false;
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="text"
          placeholder="Type something..."
          aria-label="Type a message"
          value={message}
          onPaste={handlePaste}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button type="submit" aria-label="Send the message">
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </InputGroup>
    </form>
  );
};
