import React from "react";

import { HomeLayout } from "../HomeLayout/HomeLayout";

export const ErrorPage: React.FC = () => (
  <HomeLayout>
    <p>
      Your browser is not supported. Try updating your web browser, or
      installing one that supports WebRTC (such as Chrome or Firefox).
    </p>
  </HomeLayout>
);
