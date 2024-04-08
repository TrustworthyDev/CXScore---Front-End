import { fabric } from "fabric";
import "./violationCanvas/violationCanvasObjectsMap";
import "./patches/extends-hovered-object/fabric.Canvas.patch";
import "./patches/extends-transparency/fabric.canvas.patch";

export default (id: HTMLCanvasElement | string = "canvas"): fabric.Canvas => {
  const canvas = new fabric.Canvas(id, {
    selection: false,
  });
  canvas.initializeObjectsMap();
  return canvas;
};
