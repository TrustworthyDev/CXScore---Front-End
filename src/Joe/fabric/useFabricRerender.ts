import { useCallback, useEffect, useState } from "react";

/**
 * Re-render the component when the fabric object or active selection changes.
 * Otherwise React components don't typically re-render as the object properties
 * are mutated by reference.
 */
export const useFabricRerender = <K extends keyof fabric.EventsMap>(
  event: K,
  object: fabric.Object | fabric.Canvas | null | undefined
): void => {
  // Use a state to force a re-render
  const [, setCount] = useState(0);

  const rerender = useCallback(() => {
    setCount((count) => count + 1);
  }, []);

  useFabricEventListener(event, rerender, object);
};

/**
 * Listen to fabric events.
 */
const useFabricEventListener = <K extends keyof fabric.EventsMap>(
  event: K,
  handler: (e: fabric.EventsMap[K]) => void,
  entity: fabric.Object | fabric.Canvas | null | undefined
) => {
  useEffect(() => {
    entity?.on(event, handler);

    return () => {
      entity?.off(event, handler);
    };
  }, [entity, handler, event]);
};
