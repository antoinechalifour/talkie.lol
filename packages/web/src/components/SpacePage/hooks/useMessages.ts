import { useEffect, useState } from "react";

import { useConference } from "./useConference";

export const useMessages = () => {
  const conference = useConference();
  const [messages, setMessages] = useState([...conference.messages()]);

  useEffect(
    () =>
      conference
        .observeNewMessages()
        .subscribe((newMessage) =>
          setMessages((oldMessages) => [...oldMessages, newMessage])
        ),
    [conference]
  );

  return messages;
};
