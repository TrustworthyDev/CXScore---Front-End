export const isPointerEvent = (event: Event): event is PointerEvent => {
  return supportsPointerEvents() && event instanceof PointerEvent;
};

export const isTouchPointerEvent = (event: Event): boolean => {
  return isPointerEvent(event) && event.pointerType === "touch";
};

/**
 * jsdom doesn't support PointerEvent so we need to explicitly check for this.
 * https://github.com/jsdom/jsdom/issues/2527
 */
const supportsPointerEvents = (): boolean => {
  return !!window.PointerEvent;
};
