import React from "react";

import {
  ControlsLayout,
  HeaderLayout,
  SpaceLayout,
  MainContent,
  VideoGrid,
  LocalVideoBoxLayout,
  VideoBoxLayout,
} from "./styles";
import { UserMedia } from "./UserMedia";
import { useRtc } from "./webrtc/useRtc";
import { MediaStreamBox } from "./MediaStreamBox";

export interface SpaceProps {
  userId: string;
  slug: string;
}

export const Space: React.FC<SpaceProps> = ({ userId, slug }) => {
  const { remoteMedia, userMedia, addUserMedia, removeUserMedia } = useRtc(
    slug
  );

  return (
    <SpaceLayout>
      <HeaderLayout>
        <h1>WebRTC experiment</h1>
        <p>
          {slug} <span>(space)</span>
        </p>
        <p>
          {userId} <span>(user)</span>
        </p>
      </HeaderLayout>

      <MainContent>
        <VideoGrid>
          {userMedia && (
            <LocalVideoBoxLayout>
              <MediaStreamBox mediaStream={userMedia} />
              <p>You</p>
            </LocalVideoBoxLayout>
          )}
          {remoteMedia.map((media) => (
            <VideoBoxLayout key={media.userId}>
              <MediaStreamBox mediaStream={media.mediaStream} />
            </VideoBoxLayout>
          ))}
        </VideoGrid>
      </MainContent>

      <ControlsLayout>
        <UserMedia
          addUserMedia={addUserMedia}
          removeUserMedia={removeUserMedia}
        />
      </ControlsLayout>
    </SpaceLayout>
  );
};
