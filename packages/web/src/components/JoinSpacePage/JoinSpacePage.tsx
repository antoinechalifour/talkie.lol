import React from "react";
import { Helmet } from "react-helmet";

import { createTitle } from "../../utils/html";
import { AuthenticatedClient } from "../AuthenticatedClient/AuthenticatedClient";
import { SpacePage } from "../SpacePage/SpacePage";
import { useJoinSpace } from "./useJoinSpace";
import { Button } from "../ui/Button";
import { JoinInputGroup, JoinSpacelayout, VideoLayout } from "./styles";

export interface JoinSpacePageProps {
  spaceSlug: string;
}

export const JoinSpacePage: React.FC<JoinSpacePageProps> = ({ spaceSlug }) => {
  const {
    conference,
    userName,
    setUserName,
    isFetching,
    login,
    videoRef,
  } = useJoinSpace({
    slug: spaceSlug,
  });

  if (conference) {
    return (
      <AuthenticatedClient token={conference.localUser().token()}>
        <SpacePage conference={conference} />
      </AuthenticatedClient>
    );
  }

  return (
    <JoinSpacelayout>
      <Helmet>
        <title>{createTitle(`Join space ${spaceSlug}`)}</title>
      </Helmet>

      <h2>Let's set you up...</h2>
      <p>
        Talkie requires an access to your webcam and microphone. Once granted,
        pick a nick name and start chatting with your friends!
      </p>

      <VideoLayout>
        <video ref={videoRef} autoPlay muted />

        <JoinInputGroup onSubmit={login}>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            aria-label="Your name. Leave blank for a funny name!"
            placeholder="Your name. Leave blank for a funny name!"
          />
          <Button type="submit" disabled={isFetching}>
            Join
          </Button>
        </JoinInputGroup>
      </VideoLayout>
    </JoinSpacelayout>
  );
};
