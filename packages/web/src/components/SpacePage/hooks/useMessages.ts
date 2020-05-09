import { useEffect, useState } from "react";

import { useConference } from "./useConference";

export const useMessages = () => {
  const conference = useConference();
  const [messages, setMessages] = useState([...conference.messages()]);

  useEffect(() => {
    const observer = conference.observeNewMessages();

    (async function () {
      for await (const newMessage of observer) {
        setMessages((oldMessages) => [...oldMessages, newMessage]);
      }
    })();

    return observer.cancel;
  }, [conference]);

  return messages;
};
