import React from "react";

import { useLocalUser } from "../../hooks/useLocalUser";
import { useRemotePeers } from "../../hooks/useRemotePeers";
import { LocalUserOnly } from "./LocalUserOnly";
import { DualUsers } from "./DualUsers";
import { MultipleUsers } from "./MultipleUsers";

export interface MediaGridViewProps {}

export const MediaGridView: React.FC<MediaGridViewProps> = () => {
  const localUser = useLocalUser();
  const remotePeers = useRemotePeers();

  if (remotePeers.length === 0) {
    return <LocalUserOnly localUser={localUser} />;
  } else if (remotePeers.length === 1) {
    return <DualUsers localUser={localUser} remotePeer={remotePeers[0]} />;
  }

  return <MultipleUsers localUser={localUser} remotePeers={remotePeers} />;
};
