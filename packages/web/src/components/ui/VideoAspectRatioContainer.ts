import styled from "styled-components/macro";
import { motion } from "framer-motion";

export const VideoAspectRatioContainer = styled(motion.div)`
  position: relative;

  &:after {
    content: "";
    display: block;
    padding-bottom: 75%;
  }

  video {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: 100%;
    max-width: 100%;
    height: 100%;
    max-height: 100%;
  }
`;
