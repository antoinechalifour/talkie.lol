import { useEffect, useState } from "react";

import { useConference } from "./useConference";

// @ts-ignore
import notificationSound from "../../../assets/new-message.mp3";

const audio = document.createElement("audio");
audio.src = notificationSound;

const playNotificationSound = () => audio.play();

export const useNewMessageNotification = () => {
  const conference = useConference();

  useEffect(
    () =>
      conference.onMessageAdded((message) => {
        if (message.author().id === conference.localUser().id()) return;

        playNotificationSound();
      }),
    [conference]
  );
};
