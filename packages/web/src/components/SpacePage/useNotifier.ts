import { useEffect } from "react";
import { toast } from "react-toastify";

// @ts-ignore
import notificationSound from "../../assets/notification.mp3";
import { ConferenceViewModel } from "../../viewmodels/ConferenceViewModel";

const audio = document.createElement("audio");
audio.src = notificationSound;

const notifyUserJoined = (userName: string) =>
  toast.info(`User ${userName} joined.`);
const notifyUserLeft = (userName: string) =>
  toast.info(`User ${userName} left.`);
const playNotificationSound = (): unknown => audio.play();

export const useNotifier = (conference: ConferenceViewModel) => {
  useEffect(() => {
    const observer = conference.observePeerAdded();

    (async function () {
      for await (const newPeer of observer) {
        notifyUserJoined(newPeer.name());
        playNotificationSound();
      }
    })();

    return observer.cancel;
  }, [conference]);

  useEffect(() => {
    const observer = conference.observePeerRemoved();

    (async function () {
      for await (const oldPeer of observer) {
        notifyUserLeft(oldPeer.name());
      }
    })();

    return observer.cancel;
  }, [conference]);
};
