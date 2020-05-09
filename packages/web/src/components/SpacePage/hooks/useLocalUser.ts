import { useEffect, useState } from "react";

import { useConference } from "./useConference";

export const useLocalUser = () => {
  const conference = useConference();
  const [{ value }, setLocalUser] = useState({
    value: conference.localUser(),
  });

  useEffect(() => {
    const observable = conference.observeLocalUser();

    observable.subscribe((value) => setLocalUser({ value }));

    return observable.cancel;
  }, [conference]);

  return value;
};
