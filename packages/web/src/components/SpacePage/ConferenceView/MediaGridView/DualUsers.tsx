import React from "react";

import { User } from "../../../../models/User";
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

    <div>
      <LocalMediaView
        id={localUser.id()}
        name={localUser.name()}
        mediaStream={localUser.mediaStream()}
      />
    </div>
  </DualStreamLayout>
);
