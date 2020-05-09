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
    const observable = conference.observePeerAdded();

    observable.subscribe((newPeer) => {
      notifyUserJoined(newPeer.name());
      playNotificationSound();
    });

    return observable.cancel;
  }, [conference]);

  useEffect(() => {
    const observable = conference.observePeerRemoved();

    observable.subscribe((oldPeer) => {
      notifyUserLeft(oldPeer.name());
    });

    return observable.cancel;
  }, [conference]);
};
