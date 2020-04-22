import React from "react";

import { HomeLayout } from "../HomeLayout/HomeLayout";
import { Content } from "./styles";

export const ErrorLayout: React.FC = ({ children }) => (
  <HomeLayout>
    <Content>{children}</Content>
  </HomeLayout>
);
