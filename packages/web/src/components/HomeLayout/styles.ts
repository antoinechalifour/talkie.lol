import styled from "styled-components/macro";
import { motion } from "framer-motion";

export const Background = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  text-align: center;
`;

export const appTitleVariants = {
  start: {
    transition: {
      staggerChildren: 0.2,
    },
  },
  end: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export const AppTitle = styled(motion.h1)`
  font-size: 8rem;
  letter-spacing: 0.5rem;
  font-family: var(--font-secondary);
  margin-bottom: 2rem;
  text-shadow: 0 1px 12px #000;
`;

export const appTitlePartVariants = {
  start: {
    opacity: 0,
  },
  end: {
    opacity: 1,
  },
};

export const appTitlePartTransition = {
  duration: 1,
  ease: "easeInOut",
};
