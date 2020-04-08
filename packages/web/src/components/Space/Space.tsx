import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import {
  ControlsLayout,
  HeaderLayout,
  SpaceLayout,
  MainContent,
  VideoGrid,
  LocalVideoBoxLayout,
  VideoBoxLayout,
} from "./styles";
import { UserMediaControls } from "./UserMediaControls/UserMediaControls";
import { useRtc } from "./webrtc/useRtc";
import { MediaStreamBox } from "./MediaStreamBox/MediaStreamBox";

export interface SpaceProps {
  userName: string;
  slug: string;
}

export const Space: React.FC<SpaceProps> = ({ userName, slug }) => {
  const { remoteMedia, userMedia, addUserMedia, removeUserMedia } = useRtc(
    slug
  );

  return (
    <SpaceLayout>
      <HeaderLayout>
        <h1>
          WebRTC Experiments
          <span> / {slug}</span>
        </h1>
        <p>
          <FontAwesomeIcon icon={faUser} /> {userName}
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
            <VideoBoxLayout key={media.user.id}>
              <MediaStreamBox mediaStream={media.mediaStream} />
              <p>{media.user.name}</p>
            </VideoBoxLayout>
          ))}
        </VideoGrid>
      </MainContent>

      <ControlsLayout>
        <UserMediaControls
          addUserMedia={addUserMedia}
          removeUserMedia={removeUserMedia}
        />
      </ControlsLayout>
    </SpaceLayout>
  );
};
