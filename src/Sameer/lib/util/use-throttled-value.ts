import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_THROTTLE_MS = 500;

const getRemainingTime = (lastTriggeredTime: number, throttleMs: number) => {
  const elapsedTime = Date.now() - lastTriggeredTime;
  const remainingTime = throttleMs - elapsedTime;

  return remainingTime < 0 ? 0 : remainingTime;
};

export type useThrottledValueProps<T> = {
  value: T;
  throttleMs?: number;
};

const useThrottledValue = <T>({
  value,
  throttleMs = DEFAULT_THROTTLE_MS,
}: useThrottledValueProps<T>) => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastTriggered = useRef<number>(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    let remainingTime = getRemainingTime(lastTriggered.current, throttleMs);

    if (remainingTime === 0) {
      lastTriggered.current = Date.now();
      setThrottledValue(value);
      cancel();
    } else if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        remainingTime = getRemainingTime(lastTriggered.current, throttleMs);

        if (remainingTime === 0) {
          lastTriggered.current = Date.now();
          setThrottledValue(value);
          cancel();
        }
      }, remainingTime);
    }

    return cancel;
  }, [cancel, throttleMs, value]);

  return throttledValue;
};

export default useThrottledValue;
