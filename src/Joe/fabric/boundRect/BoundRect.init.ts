import { CanvasObjectType, ViolationType } from "@/types/enum";
import { fabric } from "fabric";
import { lockObject } from "../utils";

export interface BoundRectMixin {
  fontFamily: string;
  fontSize: number;
}

const mixin: BoundRectMixin & Partial<fabric.Object> = {
  type: CanvasObjectType.BoundRect,

  rx: 10,
  ry: 10,
  fontFamily: "Chakra Petch",
  fontSize: 18,
  fill: "transparent",
  padding: 5,

  // @ts-expect-error TS incorrectly picks fabric's native initialize definition
  initialize(
    this: fabric.BoundRect,
    canvas: fabric.Canvas,
    text: string,
    violationType: ViolationType = ViolationType.manual,
    boundColor: string,
    options: Partial<fabric.BoundRectObjectConstructorConfig> = {}
  ) {
    this.text = text;
    this.canvas = canvas;
    this.violationType = violationType;
    this.boundColor = boundColor;
    this.fontSize = text.length >= 3 ? 18 - text.length : 16;
    const left = Math.max(options.left - 4, 0);
    const top = Math.max(options.top - 4, 0);
    this.callSuper("initialize", {
      ...options,
      left,
      top,
      width: options.width + 8,
      height: options.height + 8,
      stroke: `${boundColor}`,
    });
    lockObject(this);
    // this.on("selected", () => {
    //   this.bringToFront();
    //   this.set({
    //     opacity: 1,
    //   });
    // });
    // this.on("deselected", () => {
    //   this.set({
    //     opacity: 0.8,
    //   });
    // });
  },

  _render(this: fabric.BoundRect, ctx: CanvasRenderingContext2D) {
    if (!this.canvas) {
      return;
    }
    this.callSuper("_render", ctx);
    if (this.text === "") {
      return;
    }
    const isActive = this.canvas.getActiveObject() === this;

    const left = -(this.width ?? 0) / 2;
    const top = -(this.height ?? 0) / 2;

    ctx.font = `${this.fontSize}px ${this.fontFamily}`;

    ctx.fillStyle = this.boundColor;
    ctx.beginPath();
    const radius = 15;
    ctx.arc(left + radius, top + radius, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.text, left + radius, top + radius);
  },
};

fabric.BoundRect = fabric.util.createClass(fabric.Rect, mixin);
