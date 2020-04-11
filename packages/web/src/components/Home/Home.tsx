import React from "react";
import { Background, AppTitle } from "./styles";

export const Home: React.FC = ({ children }) => (
  <Background>
    <AppTitle>WebRTC Experiments</AppTitle>
    {children}
  </Background>
);
