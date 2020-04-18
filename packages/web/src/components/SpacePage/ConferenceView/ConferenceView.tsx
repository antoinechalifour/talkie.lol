import React, { useMemo, useState } from "react";

import { MediaGridView } from "./MediaGridView/MediaGridView";
import { ChatView } from "./ChatView/ChatView";
import { MediaControlsView } from "./MediaControlsView/MediaControlsView";
import { ZenMode } from "./ZenMode/ZenMode";
import { pictureInPictureContext } from "./pictureInPictureContext";
import { zenModeContext } from "./zenModeContext";
import {
  ChatArea,
  ConferenceLayout,
  MediaArea,
  MediaControlsArea,
} from "./styles";

export interface ConferenceViewProps {}

export const ConferenceView: React.FC<ConferenceViewProps> = () => {
  // Picture In Picture
  const [pictureInPictureVideoId, setPictureInPictureVideoId] = useState<
    string | null
  >(null);
  const pictureInPicture = useMemo(
    () => ({
      pictureInPictureVideoId,
      setPictureInPictureVideoId,
    }),
    [pictureInPictureVideoId, setPictureInPictureVideoId]
  );

  // Zen Mode
  const [zenModeUserId, setZenModeUserId] = useState<string | null>(null);
  const zenMode = useMemo(
    () => ({
      userId: zenModeUserId,
      enterZenMode: (userId: string) => setZenModeUserId(userId),
      exitZenMode: () => setZenModeUserId(null),
    }),
    [zenModeUserId]
  );

  return (
    <pictureInPictureContext.Provider value={pictureInPicture}>
      <zenModeContext.Provider value={zenMode}>
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

        <ZenMode />
      </zenModeContext.Provider>
    </pictureInPictureContext.Provider>
  );
};
