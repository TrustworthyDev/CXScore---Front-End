import { useEffect } from "react";

export const useKeydown = (key: string, cb: (e: KeyboardEvent) => void) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === key) {
        cb(e);
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [cb]);
};
