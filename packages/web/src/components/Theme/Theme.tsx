import React, { useEffect, useMemo, useState } from "react";

import { themeContext } from "./themeContext";

export const Theme: React.FC = ({ children }) => {
  const [isLightMode, setLightMode] = useState(false);
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

  return (
    <themeContext.Provider value={context}>{children}</themeContext.Provider>
  );
};
