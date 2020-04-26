import React, { useMemo, useState } from "react";

import { dropdownContext } from "./dropdownContext";
import { DropdownGroup } from "./styles";
import { AnimatePresence } from "framer-motion";

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

  const childrenArray = React.Children.toArray(children);

  return (
    <dropdownContext.Provider value={context}>
      <DropdownGroup>
        {childrenArray[0]}

        <AnimatePresence>{isOpen && childrenArray[1]}</AnimatePresence>
      </DropdownGroup>
    </dropdownContext.Provider>
  );
};
