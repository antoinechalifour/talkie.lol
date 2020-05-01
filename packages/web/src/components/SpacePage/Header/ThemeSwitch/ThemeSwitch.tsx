import React, { useEffect, useState } from "react";
import Tooltip from "@reach/tooltip";

import { Switch } from "../../../ui/Switch/Switch";
import { useTheme } from "../../../Theme/useTheme";
import { tooltipStyle } from "./styles";

export const ThemeSwitch = () => {
  const theme = useTheme();

  const label = theme.isLightMode
    ? "Switch to dark mode"
    : "Switch to light mode";

  return (
    <Tooltip label={label} style={tooltipStyle}>
      <div>
        <Switch
          id="theme-switch"
          label={label}
          isOn={theme.isLightMode}
          onChange={theme.toggleThemeMode}
        />
      </div>
    </Tooltip>
  );
};
