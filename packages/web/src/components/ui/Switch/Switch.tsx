import React from "react";

import { VisuallyHidden } from "../VisuallyHidden";
import { Label } from "./styles";

export interface SwitchProps {
  id: string;
  label: string;
  isOn: boolean;
  onChange: (isOn: boolean) => void;
}

export const Switch: React.FC<SwitchProps> = ({
  id,
  label,
  isOn,
  onChange,
}) => (
  <Label htmlFor={id}>
    <VisuallyHidden>{label}</VisuallyHidden>

    <input
      type="checkbox"
      id={id}
      name={id}
      checked={isOn}
      onChange={(e) => onChange(e.target.checked)}
    />

    <span />
  </Label>
);
