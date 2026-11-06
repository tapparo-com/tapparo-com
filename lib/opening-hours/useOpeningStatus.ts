"use client";

import { useEffect, useState } from "react";
import {
  getOpeningStatus,
  type HoursSettings,
  type OpeningStatus,
} from "./index";

export function useOpeningStatus(
  settings: HoursSettings | null | undefined,
): OpeningStatus {
  const [status, setStatus] = useState<OpeningStatus>("unknown");
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const update = () => {
      clearTimeout(timer);
      setStatus(getOpeningStatus(settings));
      // Align with minute boundaries; refresh immediately after sleep/backgrounding.
      timer = setTimeout(update, 60_000 - (Date.now() % 60_000) + 25);
    };
    update();
    window.addEventListener("focus", update);
    window.addEventListener("pageshow", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", update);
      window.removeEventListener("pageshow", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, [settings]);
  return status;
}
