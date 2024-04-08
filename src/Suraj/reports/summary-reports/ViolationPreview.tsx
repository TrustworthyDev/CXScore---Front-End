import React, { useEffect } from "react";
import { fetchImgWithAuthentication } from "@/utils";
import { lockObject } from "@/fabric/utils";
import { createBoundRectObject } from "@/fabric/boundRect/BoundRect.func";
import { fabric } from "fabric";
import { SummaryCanvasElementProps } from "@/fabric/SummaryVisualBoard";
import { ViolationType } from "@/types/enum";

export type ViolationPreviewProps = SummaryCanvasElementProps & {
  className?: string;
  scrollRef?: React.RefObject<HTMLDivElement>;
};

type ValidationBoundBox = {
  uuid: string;
  validation: ApiViolation;
};

const DEFAULT_CANVAS_RATIO = 0.7;
const DEFAULT_CANVAS_MARGIN = 100;

const ViolationPreview: React.FC<ViolationPreviewProps> = ({
  canvas,
  validationObjs,
  scrollRef,
}) => {
  const validationObj = validationObjs[0];

  useEffect(() => {
    initializeDraw();
  }, [canvas, validationObj]);

  const initializeDraw = async () => {
    if (!canvas || !validationObj) {
      return;
    }
    canvas.clear();

    const snapshotUrl = validationObj.snapshotUrl;
    const snapshotImage = await fetchImgWithAuthentication(snapshotUrl);
    const image = new Image();
    image.src = snapshotImage;
    image.onload = async () => {
      if (scrollRef?.current) {
        canvas.setZoom(scrollRef.current.clientWidth / (image.width + 10));
      }
      const zoom = canvas.getZoom();
      canvas.setWidth((image.width + 10) * zoom);
      canvas.setHeight(canvas.getWidth() * DEFAULT_CANVAS_RATIO);
      let filterY = 0,
        filterH = (image.width + 10) * DEFAULT_CANVAS_RATIO;
      const { bounds, rule } = validationObj;
      if (bounds && bounds.w + bounds.h > 0) {
        filterH = Math.max(filterH, bounds.h + DEFAULT_CANVAS_MARGIN * 2);
        filterY = bounds.y - (filterH - bounds.h) / 2;
        if (filterY < 0) {
          filterH = filterH + filterY;
          filterY = 0;
        }
        filterH = Math.min(filterH, image.height + 10 - filterY);
        canvas.setHeight(filterH * zoom);
        createBoundRectObject({
          canvas,
          rect: { ...bounds, y: bounds.y - filterY },
          labelText: "!",
          violationType: rule?.type ?? ViolationType.automated,
          color: "#AC4B4B",
          // fillColor: "rgba(100, 0, 0, 0.4)",
          strokeWidth: 10,
        });
      }

      fabric.Image.fromURL(snapshotImage, async (image) => {
        const snapshotImage = image.set({ left: 0, top: -filterY });
        lockObject(snapshotImage, false);
        await canvas.add(snapshotImage);
        snapshotImage.sendToBack();
      });
      canvas.renderAll();
    };
  };

  return <></>;
};

export default ViolationPreview;
