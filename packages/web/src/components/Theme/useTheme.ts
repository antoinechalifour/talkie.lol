import { useContext } from "react";

import { themeContext } from "./themeContext";

export const useTheme = () => {
  const theme = useContext(themeContext);

  if (!theme) {
    throw new Error("Missing <Theme />");
  }

  return theme;
};
