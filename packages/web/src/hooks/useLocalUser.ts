import { useEffect, useState } from "react";

import { ConferenceViewModel } from "../viewmodels/ConferenceViewModel";

export const useLocalUser = (conference: ConferenceViewModel) => {
  const [{ value }, setLocalUser] = useState({
    value: conference.localUser(),
  });

  useEffect(
    () => conference.onLocalUserChanged((value) => setLocalUser({ value })),
    [conference]
  );

  return value;
};
