import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence } from "framer-motion";

import { useZenMode } from "../useZenMode";
import { useConference } from "../../hooks/useConference";
import { ExitButton, Video, ZenModeLayout } from "./styles";
import { videoAnimation, zenModeAnimation } from "./animations";

export const ZenMode: React.FC = () => {
  const zenMode = useZenMode();
  const conference = useConference();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") zenMode.exitZenMode();
    };

    window.addEventListener("keyup", closeOnEscape);

    return () => {
      window.addEventListener("keyup", closeOnEscape);
    };
  }, [zenMode]);

  useEffect(() => {
    if (!videoRef.current) return;
    if (!zenMode.userId) return;

    const user = conference.userById(zenMode.userId);

    videoRef.current.srcObject = user.mediaStream();
  }, [conference, zenMode.userId]);

  const showModal = !!zenMode.userId;

  return (
    <AnimatePresence>
      {showModal && (
        <ZenModeLayout
          variants={zenModeAnimation.variants}
          initial="closed"
          animate="open"
          exit="closed"
        >
          <Video
            ref={videoRef}
            autoPlay
            muted
            variants={videoAnimation.variants}
          />

          <ExitButton onClick={zenMode.exitZenMode}>
            <FontAwesomeIcon icon={faTimes} />
          </ExitButton>
        </ZenModeLayout>
      )}
    </AnimatePresence>
  );
};
