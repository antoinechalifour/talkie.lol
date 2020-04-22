import React from "react";

import { ErrorLayout } from "../ErrorLayout/ErrorLayout";

export const MobileNotSupportedPage: React.FC = () => (
  <ErrorLayout>
    <p>Small devices are not supported. Please use on a desktop browser.</p>
  </ErrorLayout>
);
