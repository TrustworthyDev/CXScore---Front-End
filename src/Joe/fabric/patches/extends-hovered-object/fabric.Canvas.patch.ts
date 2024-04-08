import { isTouchPointerEvent } from "@/utils/eventUtils";
import { fabric } from "fabric";
// import { isTouchPointerEvent } from "../../../../tools/events";
// import { HighlightHoveredObjectMode } from "../../../../types/enum";
// import { flattenObjectTree } from "../../../utils/fabricObjects";

export interface CanvasHoveredObject {
  _highlightPadding: number;
  _hoveredObject?: fabric.Object;

  attachHoverEvents(): void;

  onObjectMouseOver(e: fabric.IEvent): void;
  onObjectMouseOut(e: fabric.IEvent): void;
  onObjectMouseDown(e: fabric.IEvent): void;
  _onHoveredObjectChange(object?: fabric.Object): void;
}

const mixin: CanvasHoveredObject = {
  _highlightPadding: 0,

  attachHoverEvents(this: fabric.Canvas) {
    const events: fabric.EventHandlers = {
      "mouse:over": this.onObjectMouseOver.bind(this),
      "mouse:out": this.onObjectMouseOut.bind(this),
      "mouse:down": this.onObjectMouseDown.bind(this),
    };

    this.on(events);
  },

  onObjectMouseOver(this: fabric.Canvas, { target }: fabric.IEvent) {
    this._onHoveredObjectChange(target);
  },

  onObjectMouseOut(this: fabric.Canvas, { e }: fabric.IEvent) {
    if (isTouchPointerEvent(e) && e.type === "pointerout") {
      /**
       * The browser will automatically fire a `pointerout` event after a
       * `pointerup` event. Prevent this event from immediately removing
       * the hovered object.
       */
      return;
    }

    this._onHoveredObjectChange(undefined);
  },

  onObjectMouseDown(this: fabric.Canvas, { e, target }: fabric.IEvent) {
    if (isTouchPointerEvent(e) && e.type === "pointerdown") {
      this._onHoveredObjectChange(target);
    }
  },

  /**
   * @TODO This method doesn't work well with overlapping objects. For instance if a sticky note has
   * some attached comments or lines, the _hoveredObject will often be the latter.
   */
  _onHoveredObjectChange(this: fabric.Canvas, object?: fabric.Object) {
    this._hoveredObject = object;
    this.trigger("custom:canvas:hover:change");

    // only rerender canvas in certain cases for performance reasons
    //this.requestRenderAll();
  },
};

fabric.util.object.extend(fabric.Canvas.prototype, mixin);
