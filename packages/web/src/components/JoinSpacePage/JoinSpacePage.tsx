import React from "react";
import { Helmet } from "react-helmet";
import { AnimatePresence, motion } from "framer-motion";

import { createTitle } from "../../utils/html";
import { AuthenticatedClient } from "../AuthenticatedClient/AuthenticatedClient";
import { SpacePage } from "../SpacePage/SpacePage";
import { Button } from "../ui/Button";
import { VStack } from "../ui/VStack";
import { fadeIn, scaleY } from "../ui/animations";
import { ErrorSection } from "../ui/ErrorSection";
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
    isError,
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
          Talkie requires an access to your camera and microphone. Once granted,
          pick a name and start chatting with your friends!
        </motion.p>

        <AnimatePresence>
          {isError && (
            <ErrorSection
              variants={scaleY.variants}
              initial="close"
              animate="open"
              exit="close"
            >
              <p>
                Could not join space {spaceSlug}. Make sure the space exists or
                ask your friend for a new QR Code!
              </p>
            </ErrorSection>
          )}
        </AnimatePresence>

        <VideoLayout variants={fadeIn.variants} transition={fadeIn.transition}>
          <video ref={videoRef} autoPlay muted />

          <form onSubmit={login}>
            <JoinInputGroup>
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
          </form>
        </VideoLayout>
      </VStack>
    </JoinSpacelayout>
  );
};
