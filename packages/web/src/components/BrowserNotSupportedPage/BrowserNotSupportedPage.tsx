import React from "react";

import { ErrorLayout } from "../ErrorLayout/ErrorLayout";

export const BrowserNotSupportedPage: React.FC = () => (
  <ErrorLayout>
    <p>
      Your browser is not supported. Try updating your web browser, or
      installing one that supports WebRTC and the WebAudio API (such as Chrome
      or Firefox).
    </p>
  </ErrorLayout>
);
