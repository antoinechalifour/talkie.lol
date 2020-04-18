import React, { useMemo, useState } from "react";

import { dropdownContext } from "./dropdownContext";
import { DropdownGroup } from "./styles";

export const DropdownButton: React.FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const context = useMemo(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((isCurrentlyOpen) => !isCurrentlyOpen),
    }),
    [isOpen, setIsOpen]
  );

  const childrenToRender = isOpen
    ? children
    : React.Children.toArray(children)[0];

  return (
    <dropdownContext.Provider value={context}>
      <DropdownGroup>{childrenToRender}</DropdownGroup>
    </dropdownContext.Provider>
  );
};
