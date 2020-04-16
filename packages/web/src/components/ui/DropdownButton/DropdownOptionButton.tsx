import React, { useCallback } from "react";
import { useDropdownContext } from "./useDropdownContext";
import { OptionButton } from "./styles";

export interface DropdownOptionButtonProps {
  onClick: () => void;
}

export const DropdownOptionButton: React.FC<DropdownOptionButtonProps> = ({
  onClick,
  children,
}) => {
  const context = useDropdownContext();
  const handleClick = useCallback(() => {
    context.close();
    onClick();
  }, [onClick, context]);

  return <OptionButton onClick={handleClick}>{children}</OptionButton>;
};
