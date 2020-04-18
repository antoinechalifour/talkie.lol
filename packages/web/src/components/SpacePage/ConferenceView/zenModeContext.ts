import { createContext } from "react";

import { ZendModeState } from "./types";

export const zenModeContext = createContext<ZendModeState | null>(null);
