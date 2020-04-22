import { useEffect, useState } from "react";

export const useMediaQuery = (mediaQuery: string) => {
  const [matches, setMatches] = useState(window.matchMedia(mediaQuery).matches);

  useEffect(() => {
    const watcher = window.matchMedia(mediaQuery);

    watcher.onchange = (e: MediaQueryListEvent) => setMatches(e.matches);
  }, [mediaQuery]);

  return matches;
};
