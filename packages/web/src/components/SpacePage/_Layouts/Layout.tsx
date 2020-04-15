import React from "react";

import { ConferenceViewModel } from "../../../viewmodels/ConferenceViewModel";
import { PocLayout } from "./PocLayout/PocLayout";

export interface LayoutProps {
  conference: ConferenceViewModel;
}

export const Layout: React.FC<LayoutProps> = ({ conference }) => {
  return <PocLayout />;
};
