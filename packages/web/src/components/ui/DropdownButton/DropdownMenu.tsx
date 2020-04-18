import React, { useRef } from "react";
import useOnClickOutside from "use-onclickoutside";

import { DropdownMenuLayout } from "./styles";
import { useDropdownContext } from "./useDropdownContext";

export const DropdownMenu: React.FC = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const context = useDropdownContext();

  useOnClickOutside(ref, context.close);

  return <DropdownMenuLayout ref={ref}>{children}</DropdownMenuLayout>;
};
