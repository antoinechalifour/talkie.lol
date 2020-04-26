import React from "react";

import {
  AppTitle,
  fadeInTransition,
  fadeInVariants,
  pageVariants,
  Page,
  PageContent,
} from "./styles";

export const HomeLayout: React.FC = ({ children }) => (
  <Page initial="start" animate="end" variants={pageVariants}>
    <AppTitle variants={fadeInVariants} transition={fadeInTransition}>
      Talkie.LOL
    </AppTitle>

    <PageContent
      key={window.location.pathname}
      variants={fadeInVariants}
      transition={fadeInTransition}
    >
      {children}
    </PageContent>
  </Page>
);
