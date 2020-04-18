import { useEffect, useState } from "react";

import { useConference } from "./useConference";

export const useMessages = () => {
  const conference = useConference();
  const [messages, setMessages] = useState(conference.messages());

  useEffect(
    () =>
      conference.onMessageAdded(() => setMessages([...conference.messages()])),
    [conference]
  );

  return messages;
};
