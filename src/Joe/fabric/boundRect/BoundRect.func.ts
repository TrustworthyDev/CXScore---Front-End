import { ViolationType } from "@/types/enum";
import { fabric } from "fabric";
import "./index";
import { v4 as uuid } from "uuid";

type BoundRectObjectConfig = ViolationBoundRectObjectConfig & {
  color: string;
  strokeWidth?: number;
  fillColor?: string;
  opacity?: number;
};

export const createBoundRectObject = async ({
  canvas,
  labelText,
  rect,
  color,
  fillColor = "transparent",
  opacity,
  strokeWidth = 1,
  violationType = ViolationType.manual,
}: BoundRectObjectConfig) => {
  const boundRect = new fabric.BoundRect(
    canvas,
    labelText,
    violationType,
    color,
    {
      fill: fillColor,
      opacity,
      strokeWidth,
      top: rect.y,
      left: rect.x,
      width: rect.w,
      height: rect.h,
    }
  );
  boundRect.uuid = uuid();
  await canvas.add(boundRect);
  return boundRect.uuid;
};

type ViolationBoundRectObjectConfig = {
  canvas: fabric.Canvas;
  labelText: string;
  rect: Rectangle;
  violationType?: ViolationType;
};

const violationRectStyle = {
  [ViolationType.automated]: "#AC4B4B",
  [ViolationType.manual]: "#003EB7",
};

export const createViolationBoundRectObject = async ({
  canvas,
  labelText,
  rect,
  violationType = ViolationType.manual,
}: ViolationBoundRectObjectConfig) => {
  return createBoundRectObject({
    canvas,
    labelText,
    rect,
    violationType,
    color: violationRectStyle[violationType],
  });
};
