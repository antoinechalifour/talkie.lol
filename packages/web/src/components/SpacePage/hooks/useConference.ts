import { useContext } from "react";

import { conferenceContext } from "../context";

export const useConference = () => {
  const conference = useContext(conferenceContext);

  if (!conference) throw new Error("Missing conferenceContext.Provider");

  return conference;
};
