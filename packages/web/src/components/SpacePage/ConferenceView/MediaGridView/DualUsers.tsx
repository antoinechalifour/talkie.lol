import React from "react";

import { User } from "../../../../models/User";
import { VideoAspectRatioContainer } from "../../../ui/VideoAspectRatioContainer";
import { UserMediaView } from "./UserMediaView/UserMediaView";
import { LocalMediaView } from "./UserMediaView/LocalMediaView";
import { DualStreamLayout } from "./styles";

export interface DualUsersProps {
  localUser: User;
  remotePeer: User;
}

export const DualUsers: React.FC<DualUsersProps> = ({
  localUser,
  remotePeer,
}) => (
  <DualStreamLayout>
    <UserMediaView
      id={remotePeer.id()}
      name={remotePeer.name()}
      mediaStream={remotePeer.mediaStream()}
    />

    <VideoAspectRatioContainer>
      <LocalMediaView
        id={localUser.id()}
        mediaStream={localUser.mediaStream()}
      />
    </VideoAspectRatioContainer>
  </DualStreamLayout>
);
