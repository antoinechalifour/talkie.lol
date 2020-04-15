import { useEffect, useState } from "react";

import { useConference } from "./useConference";

export const useLocalUser = () => {
  const conference = useConference();
  const [{ value }, setLocalUser] = useState({
    value: conference.localUser(),
  });

  useEffect(
    () => conference.onLocalUserChanged((value) => setLocalUser({ value })),
    [conference]
  );

  return value;
};
