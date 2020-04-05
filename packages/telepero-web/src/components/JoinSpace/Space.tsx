import React from "react";
import { UserMedia } from "./UserMedia";
import { Video } from "./Video";
import { useRtc } from "./webrtc/useRtc";

export interface SpaceProps {
  userId: string;
  slug: string;
}

export const Space: React.FC<SpaceProps> = ({ userId, slug }) => {
  const { remoteMedia, userMedia, addUserMedia, removeUserMedia } = useRtc(
    slug
  );

  return (
    <main>
      <h1>Welcome to space "{slug}"</h1>
      <p>Logged in as user {userId}</p>

      <UserMedia
        addUserMedia={addUserMedia}
        removeUserMedia={removeUserMedia}
      />

      <section>
        <h2>Local video</h2>
        {userMedia && <Video mediaStream={userMedia} />}
      </section>

      <section>
        <h2>Peers</h2>
        {remoteMedia.map((media) => (
          <Video key={media.userId} mediaStream={media.mediaStream} />
        ))}
      </section>
    </main>
  );
};
