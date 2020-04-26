import React from "react";

import { fadeIn } from "../ui/animations";
import { AppTitle, Page, PageContent } from "./styles";

export const HomeLayout: React.FC = ({ children }) => (
  <Page initial="start" animate="end" variants={fadeIn.orchestratorVariants}>
    <AppTitle variants={fadeIn.variants} transition={fadeIn.transition}>
      Talkie.LOL
    </AppTitle>

    <PageContent variants={fadeIn.variants} transition={fadeIn.transition}>
      {children}
    </PageContent>
  </Page>
);
