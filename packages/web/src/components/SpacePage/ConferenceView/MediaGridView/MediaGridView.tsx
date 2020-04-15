import React from "react";
import { MainMediaArea, MediaArea, MediaGridLayout } from "./styles";
import { UserMediaView } from "./UserMediaView/UserMediaView";
import { useMediaGridView } from "./useMediaGridView";

export interface MediaGridViewProps {}

export const MediaGridView: React.FC<MediaGridViewProps> = () => {
  const { mainUser, otherUsers } = useMediaGridView();

  return (
    <MediaGridLayout>
      <MainMediaArea>
        <UserMediaView
          name={mainUser.name()}
          mediaStream={mainUser.mediaStream()}
        />
      </MainMediaArea>

      {otherUsers.map((user) => (
        <MediaArea key={user.id()}>
          <UserMediaView name={user.name()} mediaStream={user.mediaStream()} />
        </MediaArea>
      ))}
    </MediaGridLayout>
  );
};
