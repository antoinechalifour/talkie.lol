import React from "react";

import { Background, AppTitle } from "./styles";

export const HomeLayout: React.FC = ({ children }) => (
  <Background>
    <AppTitle>Talkie.LOL</AppTitle>
    {children}
  </Background>
);
