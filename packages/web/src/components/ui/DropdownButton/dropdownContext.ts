import { createContext } from "react";
import { DropdownContext } from "./types";

export const dropdownContext = createContext<DropdownContext | null>(null);
