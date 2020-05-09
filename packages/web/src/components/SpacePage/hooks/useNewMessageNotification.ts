import { useEffect } from "react";

import { useConference } from "./useConference";

// @ts-ignore
import notificationSound from "../../../assets/new-message.mp3";

const audio = document.createElement("audio");
audio.src = notificationSound;

const playNotificationSound = (): unknown => audio.play();

export const useNewMessageNotification = () => {
  const conference = useConference();

  useEffect(() => {
    const observer = conference.observeNewMessages();

    (async function () {
      for await (const message of observer) {
        if (message.author().id === conference.localUser().id()) continue;

        playNotificationSound();
      }
    })();

    return observer.cancel;
  }, [conference]);
};
