import { useContext } from "react";
import { dropdownContext } from "./dropdownContext";

export const useDropdownContext = () => {
  const context = useContext(dropdownContext);

  if (!context) {
    throw new Error("Missing DropdownButton component");
  }

  return context;
};
