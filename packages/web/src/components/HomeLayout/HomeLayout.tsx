import React from "react";
import { motion } from "framer-motion";

import {
  Background,
  AppTitle,
  appTitleVariants,
  appTitlePartVariants,
  appTitlePartTransition,
} from "./styles";

export const HomeLayout: React.FC = ({ children }) => (
  <Background>
    <AppTitle initial="start" animate="end" variants={appTitleVariants}>
      <motion.span
        variants={appTitlePartVariants}
        transition={appTitlePartTransition}
      >
        Talkie
      </motion.span>
      <motion.span
        variants={appTitlePartVariants}
        transition={appTitlePartTransition}
      >
        .
      </motion.span>
      <motion.span
        variants={appTitlePartVariants}
        transition={appTitlePartTransition}
      >
        L
      </motion.span>
      <motion.span
        variants={appTitlePartVariants}
        transition={appTitlePartTransition}
      >
        O
      </motion.span>
      <motion.span
        variants={appTitlePartVariants}
        transition={appTitlePartTransition}
      >
        L
      </motion.span>
    </AppTitle>
    {children}
  </Background>
);
