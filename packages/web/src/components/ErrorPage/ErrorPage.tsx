import React from "react";

import { HomeLayout } from "../HomeLayout/HomeLayout";
import { Content } from "./styles";

export const ErrorPage: React.FC = () => (
  <HomeLayout>
    <Content>
      <p>
        Your browser is not supported. Try updating your web browser, or
        installing one that supports WebRTC and the WebAudio API (such as Chrome
        or Firefox).
      </p>
    </Content>
  </HomeLayout>
);
