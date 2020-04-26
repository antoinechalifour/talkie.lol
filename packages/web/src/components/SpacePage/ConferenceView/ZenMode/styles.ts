import styled from "styled-components/macro";
import { motion } from "framer-motion";

import { Button } from "../../../ui/Button";

export const ZenModeLayout = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  background: rgba(0, 0, 0, 0.65);
`;

export const Video = styled(motion.video)`
  display: block;
  max-width: 90%;
  max-height: 90%;
  width: 1200px;
  border-radius: 1px;
`;

export const ExitButton = styled(Button)`
  position: absolute;
  top: 2rem;
  right: 2rem;
  padding: 0;
  height: 30px;
  width: 30px;
  background: var(--button-background);

  display: flex;
  place-content: center;
`;
