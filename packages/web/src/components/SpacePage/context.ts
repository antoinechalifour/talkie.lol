import { createContext } from "react";

import { ConferenceViewModel } from "../../viewmodels/ConferenceViewModel";

export const conferenceContext = createContext<ConferenceViewModel | null>(
  null
);
