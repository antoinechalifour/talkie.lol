import React, { useMemo, useState } from "react";

import { MediaGridView } from "./MediaGridView/MediaGridView";
import { ChatView } from "./ChatView/ChatView";
import { MediaControlsView } from "./MediaControlsView/MediaControlsView";
import { pictureInPictureContext } from "./pictureInPictureContext";
import {
  ChatArea,
  ConferenceLayout,
  MediaArea,
  MediaControlsArea,
} from "./styles";

export interface ConferenceViewProps {}

export const ConferenceView: React.FC<ConferenceViewProps> = () => {
  const [pictureInPictureVideoId, setPictureInPictureVideoId] = useState<
    string | null
  >(null);
  const context = useMemo(
    () => ({
      pictureInPictureVideoId,
      setPictureInPictureVideoId,
    }),
    [pictureInPictureVideoId, setPictureInPictureVideoId]
  );

  return (
    <pictureInPictureContext.Provider value={context}>
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
    </pictureInPictureContext.Provider>
  );
};
