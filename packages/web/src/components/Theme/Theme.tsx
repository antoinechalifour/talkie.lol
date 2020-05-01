import React, { useEffect, useMemo, useState } from "react";

import {
  hasPrevisoulyUsedLightMode,
  persistThemeMode,
  prefersLightMode,
} from "../../utils/lightMode";
import { themeContext } from "./themeContext";

const initialStateIsLightMode =
  hasPrevisoulyUsedLightMode() || prefersLightMode();

export const Theme: React.FC = ({ children }) => {
  const [isLightMode, setLightMode] = useState(initialStateIsLightMode);

  const context = useMemo(
    () => ({
      isLightMode,
      toggleThemeMode: () => setLightMode(!isLightMode),
    }),
    [isLightMode]
  );

  useEffect(() => {
    if (isLightMode) document.body.classList.add("theme-light");
    else document.body.classList.remove("theme-light");
  }, [isLightMode]);

  useEffect(() => {
    persistThemeMode(isLightMode);
  }, [isLightMode]);

  return (
    <themeContext.Provider value={context}>{children}</themeContext.Provider>
  );
};
