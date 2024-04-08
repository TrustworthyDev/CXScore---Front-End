interface Window {
  canvas?: fabric.Canvas;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options: any
  ) => typeof import("redux").compose;
}

type CanvasElementProps = {
  canvas?: fabric.Canvas;
};

// Pick the properties in T whose type matches V
type PickMatching<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};
type MethodsOfMixin<T> = PickMatching<T, (...args: any) => void>; // eslint-disable-line @typescript-eslint/no-explicit-any

type ActionButtonConfig = {
  buttonId: string;
  buttonText: string;
  buttonStyle: string;
};

type BrowserEventType = "navigate" | "click" | "key";

type ElementSelector = {
  type: "CSS" | "XPATH" | "ARIA" | "PIERCE",
  selectors: string[],
}

type BrowserEvent = {
  type: "navigate",
  url: string,
  tag?: string,
} | {
  type: "click",
  selectorOptions: ElementSelector[],
  tag?: string,
} | {
  type: "change",
  data: string,
  selectorOptions: ElementSelector[],
  tag?: string,
}

type EventSequence = BrowserEvent[];