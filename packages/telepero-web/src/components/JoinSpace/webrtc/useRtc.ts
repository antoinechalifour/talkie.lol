import { useCallback, useState } from "react";
import { logMedia } from "./log";
import { useSignaling } from "./useSignaling";

interface UserMediaStream {
  userId: string;
  mediaStream: MediaStream;
}

export const useRtc = (slug: string) => {
  const [remoteMedia, setRemoteMedia] = useState<UserMediaStream[]>([]);
  const [userMedia, setUserMedia] = useState<MediaStream | null>(null);

  const setRemoteMediaForUser = useCallback(
    (userId: string, mediaStream: MediaStream | null) => {
      setRemoteMedia((remoteMedias) => {
        const nextState = remoteMedias.filter((x) => x.userId !== userId);

        if (mediaStream) {
          nextState.push({ userId, mediaStream });
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
