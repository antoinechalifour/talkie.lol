import { createContext } from "react";

import { ThemeContext } from "./types";

export const themeContext = createContext<ThemeContext | null>(null);
