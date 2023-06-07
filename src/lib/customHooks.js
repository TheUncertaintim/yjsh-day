import { useState, useEffect } from "react";

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = (event) => {
      setMatches(media.matches);
    };
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

export function useClientSize(width, height) {
  const [clientSize, setClientSize] = useState({
    width: width,
    height: height,
  });

  useEffect(() => {
    const listener = (event) => {
      setClientSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", listener);

    // clean up
    return () => window.removeEventListener("resize", listener);
  }, [clientSize]);

  return clientSize;
}
