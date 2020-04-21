import React from "react";

import { User } from "../../../../models/User";
import { LocalMediaView } from "./UserMediaView/LocalMediaView";
import { UserMediaView } from "./UserMediaView/UserMediaView";
import { MediaArea, MediaGridLayout } from "./styles";

export interface MultipleUsersProps {
  localUser: User;
  remotePeers: User[];
}

export const MultipleUsers: React.FC<MultipleUsersProps> = ({
  localUser,
  remotePeers,
}) => (
  <MediaGridLayout>
    <MediaArea>
      <LocalMediaView
        id={localUser.id()}
        name={localUser.name()}
        mediaStream={localUser.mediaStream()}
      />
    </MediaArea>

    {remotePeers.map((user) => (
      <MediaArea key={user.id()}>
        <UserMediaView
          id={user.id()}
          name={user.name()}
          mediaStream={user.mediaStream()}
        />
      </MediaArea>
    ))}
  </MediaGridLayout>
);
