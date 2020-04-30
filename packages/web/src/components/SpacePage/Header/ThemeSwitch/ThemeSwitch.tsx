import React, { useEffect, useState } from "react";
import Tooltip from "@reach/tooltip";

import { Switch } from "../../../ui/Switch/Switch";
import { tooltipStyle } from "./styles";

export const ThemeSwitch = () => {
  const [isLightMode, setLightMode] = useState(false);

  const label = isLightMode ? "Switch to dark mode" : "Switch to light mode";

  useEffect(() => {
    if (isLightMode) document.body.classList.add("theme-light");
    else document.body.classList.remove("theme-light");
  }, [isLightMode]);

  return (
    <Tooltip label={label} style={tooltipStyle}>
      <div>
        <Switch
          id="theme-switch"
          label={label}
          isOn={isLightMode}
          onChange={setLightMode}
        />
      </div>
    </Tooltip>
  );
};
