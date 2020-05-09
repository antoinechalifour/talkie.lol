import { useEffect, useState } from "react";

import { useConference } from "./useConference";

export const useLocalUser = () => {
  const conference = useConference();
  const [{ value }, setLocalUser] = useState({
    value: conference.localUser(),
  });

  useEffect(() => {
    const observer = conference.observeLocalUser();

    (async function () {
      for await (const value of observer) {
        setLocalUser({ value });
      }
    })();

    return observer.cancel;
  }, [conference]);

  return value;
};
