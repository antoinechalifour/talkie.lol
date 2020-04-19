import { useContext } from "react";

import { pictureInPictureContext } from "./pictureInPictureContext";

export const usePictureInPicture = () => {
  const context = useContext(pictureInPictureContext);

  if (!context) {
    throw new Error("Missing pictureInPicture context provider");
  }

  return context;
};
