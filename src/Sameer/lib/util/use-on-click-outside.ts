import { useEffect } from "react";

export function useOnClickOutside(
  ref: any,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const listener = (event: any) => {
      if (!ref || !ref.current || ref.current.contains(event.target)) {
        return;
      }
      if (
        event.offsetX > event.target.clientWidth ||
        event.offsetY > event.target.clientHeight ||
        event.target === document.querySelector("html")
      ) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
