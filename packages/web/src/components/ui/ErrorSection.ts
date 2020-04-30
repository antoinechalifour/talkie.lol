import styled from "styled-components";
import { motion } from "framer-motion";

export const ErrorSection = styled(motion.div)`
  padding: 1.5rem;
  border: 1px solid var(--color-darkred);
  border-radius: 0.4rem;

  font-weight: bold;
  font-size: 1.4rem;
  text-shadow: var(--text-shadow-1);

  color: var(--color-red);
  background: var(--color-lightred);
`;
