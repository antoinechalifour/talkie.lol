import { useEffect } from "react";
import { toast } from "react-toastify";

// @ts-ignore
import notificationSound from "./assets/notification.mp3";
import { Conference } from "./models/Conference";

const audio = document.createElement("audio");
audio.src = notificationSound;

const notifyUserJoined = (userName: string) =>
  toast.success(`User ${userName} joined.`);
const notifyUserLeft = (userName: string) => toast(`User ${userName} left.`);
const playNotificationSound = () => audio.play();

export const useNotifier = (conference: Conference) => {
  useEffect(() => {
    const unsubscribePeerAdded = conference.onRemotePeerAdded((newPeer) => {
      notifyUserJoined(newPeer.name());
      playNotificationSound();
    });

    const unsubscribePeerRemoved = conference.onRemotePeerRemoved((oldPeer) => {
      notifyUserLeft(oldPeer.name());
    });

    return () => {
      unsubscribePeerAdded();
      unsubscribePeerRemoved();
    };
  }, [conference]);
};
