import { useCallback, useState } from "react";
import { logMedia } from "./log";
import { useSignaling } from "./useSignaling";
import { User } from "./types";

interface UserMediaStream {
  user: User;
  mediaStream: MediaStream;
}

export const useRtc = (slug: string) => {
  const [remoteMedia, setRemoteMedia] = useState<UserMediaStream[]>([]);
  const [userMedia, setUserMedia] = useState<MediaStream | null>(null);

  const setRemoteMediaForUser = useCallback(
    (user: User, mediaStream: MediaStream | null) => {
      logMedia(`Changing media stream for user ${user.id}: `, mediaStream);
      setRemoteMedia((remoteMedias) => {
        const nextState = remoteMedias.filter((x) => x.user.id !== user.id);

        if (mediaStream) {
          nextState.push({ user, mediaStream });
        }

        return nextState;
      });
    },
    []
  );

  const { sendLocalMedia, cancelLocalMedia } = useSignaling({
    userMedia,
    spaceSlug: slug,
    setRemoteMediaForUser,
  });

  const addUserMedia = useCallback(
    (mediaStream: MediaStream) => {
      logMedia("🎦 Adding local stream");
      setUserMedia(mediaStream);

      sendLocalMedia(mediaStream);
    },
    [sendLocalMedia]
  );

  const removeUserMedia = useCallback(() => {
    logMedia("🎦 Removing local stream");
    setUserMedia(null);
    cancelLocalMedia();
  }, [cancelLocalMedia]);

  return {
    userMedia,
    remoteMedia,
    addUserMedia,
    removeUserMedia,
  };
};
