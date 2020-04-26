import React from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

import { createTitle } from "../../utils/html";
import { AuthenticatedClient } from "../AuthenticatedClient/AuthenticatedClient";
import { SpacePage } from "../SpacePage/SpacePage";
import { Button } from "../ui/Button";
import { VStack } from "../ui/VStack";
import { fadeIn } from "../ui/animations";
import { useJoinSpace } from "./useJoinSpace";
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

      <VStack
        initial="start"
        animate="end"
        variants={fadeIn.orchestratorVariants}
      >
        <motion.h2 variants={fadeIn.variants} transition={fadeIn.transition}>
          Let's set you up...
        </motion.h2>

        <motion.p variants={fadeIn.variants} transition={fadeIn.transition}>
          Talkie requires an access to your webcam and microphone. Once granted,
          pick a nick name and start chatting with your friends!
        </motion.p>

        <VideoLayout variants={fadeIn.variants} transition={fadeIn.transition}>
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
      </VStack>
    </JoinSpacelayout>
  );
};
