import { useEffect, useState } from "react";

import { useConference } from "./useConference";

export const useMessages = () => {
  const conference = useConference();
  const [messages, setMessages] = useState([...conference.messages()]);

  useEffect(() => {
    const observable = conference.observeNewMessages();

    observable.subscribe((newMessage) =>
      setMessages((oldMessages) => [...oldMessages, newMessage])
    );

    return observable.cancel;
  }, [conference]);

  return messages;
};
