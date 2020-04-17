import React from "react";

import { useLocalUser } from "../../hooks/useLocalUser";
import { useRemotePeers } from "../../hooks/useRemotePeers";
import { UserMediaView } from "./UserMediaView/UserMediaView";
import { MediaArea, MediaGridLayout } from "./styles";
import { LocalMediaView } from "./UserMediaView/LocalMediaView";

export interface MediaGridViewProps {}

export const MediaGridView: React.FC<MediaGridViewProps> = () => {
  const localUser = useLocalUser();
  const remotePeers = useRemotePeers();

  return (
    <MediaGridLayout>
      <MediaArea>
        <LocalMediaView
          name={localUser.name()}
          mediaStream={localUser.mediaStream()}
        />
      </MediaArea>

      {remotePeers.map((user) => (
        <MediaArea key={user.id()}>
          <UserMediaView name={user.name()} mediaStream={user.mediaStream()} />
        </MediaArea>
      ))}
    </MediaGridLayout>
  );
};
