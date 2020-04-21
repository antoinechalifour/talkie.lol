import React from "react";

import { User } from "../../../../models/User";
import { LocalUserLayout } from "./styles";
import { LocalMediaView } from "./UserMediaView/LocalMediaView";

export interface LocalUserOnlyProps {
  localUser: User;
}

export const LocalUserOnly: React.FC<LocalUserOnlyProps> = ({ localUser }) => (
  <div>
    <LocalUserLayout>
      <LocalMediaView
        mediaStream={localUser.mediaStream()}
        id={localUser.id()}
        name={localUser.name()}
      />
    </LocalUserLayout>
  </div>
);
