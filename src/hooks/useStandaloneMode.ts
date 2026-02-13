import { useState, useEffect } from "react";

/**
 * Detects if the app is running in standalone (installed PWA) mode.
 * Returns true when display-mode is standalone or fullscreen,
 * or when iOS standalone mode is active.
 */
export function useStandaloneMode() {
  const [isStandalone, setIsStandalone] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches ||
      (navigator as any).standalone === true
    );
  });

  useEffect(() => {
    const mql = window.matchMedia("(display-mode: standalone)");
    const onChange = () => {
      setIsStandalone(
        mql.matches ||
        window.matchMedia("(display-mode: fullscreen)").matches ||
        (navigator as any).standalone === true
      );
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isStandalone;
}
