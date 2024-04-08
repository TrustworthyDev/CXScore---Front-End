type ObjectSelectionEvent = {
  isKeyboardSelect?: boolean;
  isSilent?: boolean;
};

type HoverEvent = {
  e: PointerEvent;
  target?: fabric.Object;
};

type HoverOverEvent = HoverEvent & {
  previousTarget?: fabric.Object;
};

type HoverOutEvent = HoverEvent & {
  nextTarget?: fabric.Object;
};

declare namespace fabric {
  type SelectionEvent = Omit<fabric.IEvent, "e"> & {
    selected: fabric.Object[];
    deselected: fabric.Object[];
    e?: ObjectSelectionEvent | (Event & ObjectSelectionEvent);
  };
  interface IEventType<T extends Event> extends IEvent {
    e: T;
  }

  type VoidEvents = "custom:canvas:hover:change";

  type EventsMap = {
    "mouse:down": IEventType<MouseEvent | PointerEvent>;
    "mouse:move": IEventType<MouseEvent | PointerEvent>;
    "mouse:out": HoverOutEvent;
    "mouse:over": HoverOverEvent;
    "selection:cleared": SelectionEvent;
    "selection:created": SelectionEvent;
    "selection:updated": SelectionEvent;
  } & Record<VoidEvents, void>;

  type EventHandlers = {
    [K in keyof fabric.EventsMap]?: (e: fabric.EventsMap[K]) => void;
  };
  interface IObservable<T> {
    on<E extends keyof EventsMap>(
      eventName: E,
      handler: (this: this, e: EventsMap[E]) => void
    ): T;
    on(events: EventHandlers): T;
    /**
     * @deprecated Incorrect event signature
     */
    on(eventName: string, handler: (e?: any) => void): T; // eslint-disable-line @typescript-eslint/no-explicit-any
    /**
     * @deprecated Incorrect event signature - use `fabric.EventHandlers` type
     */
    on(events: { [eventName: string]: (e: fabric.IEvent) => void }): T;
    off<E extends keyof EventsMap>(
      eventName: E,
      handler?: (e: EventsMap[E]) => void
    ): T;
    /**
     * @deprecated Incorrect event signature
     */
    off(eventName: string, handler?: (e?: any) => void): T; // eslint-disable-line @typescript-eslint/no-explicit-any

    /*----------  START: distinct overloads for to comment some events which need special care   ----------*/

    /**
     * @NOTE Be sure to trigger this after all properties are updated, e.g. `setCoords`, for correct
     * connections and attachments repositioning
     */
    trigger(eventName: "modified", e: ClientModifiedEvent): T;

    /*----------  END  ----------*/

    trigger<E extends keyof EventsMap>(eventName: E, e: EventsMap[E]): T;
    trigger(eventName: VoidEvents): T;
    /**
     * @deprecated Incorrect event signature
     */
    trigger(eventName: string, e?: any): T; // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}
