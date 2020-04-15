import React from "react";

import { MediaGridView } from "./MediaGridView/MediaGridView";
import { ChatView } from "./ChatView/ChatView";
import { MediaControlsView } from "./MediaControlsView/MediaControlsView";
import {
  ChatArea,
  ConferenceLayout,
  MediaArea,
  MediaControlsArea,
} from "./styles";

export interface ConferenceViewProps {}

export const ConferenceView: React.FC<ConferenceViewProps> = () => {
  return (
    <ConferenceLayout>
      <MediaArea>
        <MediaGridView />
      </MediaArea>

      <MediaControlsArea>
        <MediaControlsView />
      </MediaControlsArea>

      <ChatArea>
        <ChatView />
      </ChatArea>
    </ConferenceLayout>
  );
};
