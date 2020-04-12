import { useEffect, useState } from "react";

import { Conference } from "./models/Conference";

export const useLocalUser = (conference: Conference) => {
  const [{ value }, setLocalUser] = useState({
    value: conference.localUser(),
  });

  useEffect(
    () => conference.onLocalUserChanged((value) => setLocalUser({ value })),
    [conference]
  );

  return value;
};
