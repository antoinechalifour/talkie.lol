import { createContext } from "react";

import { PictureInPictureState } from "./types";

export const pictureInPictureContext = createContext<PictureInPictureState | null>(
  null
);
