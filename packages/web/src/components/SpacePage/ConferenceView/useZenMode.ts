import { useContext } from "react";

import { zenModeContext } from "./zenModeContext";

export const useZenMode = () => {
  const context = useContext(zenModeContext);

  if (!context) {
    throw new Error("Missing zenMode context provider");
  }

  return context;
};
