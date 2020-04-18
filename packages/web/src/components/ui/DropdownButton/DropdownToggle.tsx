import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";

import { DropdownLayout } from "./styles";
import { useDropdownContext } from "./useDropdownContext";

export interface DropdownToggleProps {
  onClick?: () => void;
}

export const DropdownToggle: React.FC<DropdownToggleProps> = ({
  onClick,
  children,
}) => {
  const context = useDropdownContext();

  return (
    <DropdownLayout>
      <button onClick={onClick}>{children}</button>

      <button
        aria-label="Toggle dropdown"
        aria-haspopup={true}
        aria-expanded={context.isOpen}
        onClick={context.toggle}
      >
        <FontAwesomeIcon icon={faSortDown} />
      </button>
    </DropdownLayout>
  );
};
