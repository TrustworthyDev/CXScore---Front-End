import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { lockObject } from "@/fabric/utils";
import { createBoundRectObject } from "@/fabric/boundRect/BoundRect.func";
import { fabric } from "fabric";
import ViolationDetailContext from "../ViolationDetailContext";

export type CXSFocusOrderDetailCanvasProps = CanvasElementProps & {
  scrollRef?: React.RefObject<HTMLDivElement>;
  detailInfo?: CXSFocusOrderDetail;
  snapshotImage?: string;
};

export const CXSFocusOrderDetailCanvas: React.FC<
  CXSFocusOrderDetailCanvasProps
> = ({ canvas, scrollRef, snapshotImage, detailInfo }) => {
  const creationRef = useRef(false);
  const [objUuids, setObjUuids] = useState<string[]>([]);

  const { activeIndex, setActiveIndex } = useContext(ViolationDetailContext);

  useEffect(() => {
    initializeDraw();
  }, [canvas, detailInfo, snapshotImage]);

  const initializeDraw = async () => {
    if (
      !canvas ||
      !detailInfo ||
      !snapshotImage ||
      creationRef.current === true
    ) {
      return;
    }
    creationRef.current = true;

    const image = new Image();
    image.src = snapshotImage;
    image.onload = async () => {
      if (scrollRef?.current) {
        canvas.setZoom(scrollRef.current.clientWidth / (image.width + 10));
      }
      const zoom = canvas.getZoom();
      canvas.setWidth((image.width + 10) * zoom);
      canvas.setHeight((image.height + 10) * zoom);

      const colorConfig = ["rgb(22, 163, 74)", "rgb(37, 99, 235)"];
      const contentColorConfig = ["rgb(219, 39, 119)", "rgb(147, 51, 234)"];
      const fillConfig = ["rgba(22, 163, 74, 0.4)", "rgba(37, 99, 235, 0.4)"];
      const textConfig = ["SRC", "DST"];

      setObjUuids(
        await Promise.all([
          ...[detailInfo.output.source, detailInfo.output.destination].map(
            ({ path, rectangle }, index) =>
              createBoundRectObject({
                canvas,
                rect: rectangle,
                labelText: textConfig[index],
                color: colorConfig[index],
                strokeWidth: 5,
                opacity: 1,
              })
          ),
        ])
      );

      fabric.Image.fromURL(snapshotImage, async (image) => {
        const snapshotImage = image.set({ left: 0, top: 0 });
        lockObject(snapshotImage, false);
        await canvas.add(snapshotImage);
        snapshotImage.sendToBack();
      });
    };
  };

  useEffect(() => {
    if (objUuids.length === 0 || !canvas) {
      return;
    }

    if (activeIndex === -1) {
      canvas.discardActiveObject();
      return;
    }
    const targetCanvasObj = canvas.getObjectByUUID(objUuids[activeIndex]);
    if (!targetCanvasObj) {
      return;
    }
    if (targetCanvasObj === canvas.getActiveObject()) {
      return;
    }
    const zoom = canvas.getZoom();
    scrollRef?.current?.scrollTo({
      left: 0,
      top: (targetCanvasObj.top || 0) * zoom,
    });
    canvas.setActiveObject(targetCanvasObj);
    canvas.requestRenderAll();
  }, [activeIndex, canvas]);

  const handleChangeActiveObject = useCallback(
    (e: fabric.SelectionEvent) => {
      const { selected, deselected } = e;
      if (selected?.length > 0) {
        const selectedIndex = objUuids.findIndex(
          (uuid) => uuid === selected[0].uuid
        );
        if (selectedIndex !== -1) {
          setActiveIndex && setActiveIndex(selectedIndex);
          return;
        }
      }
      if (deselected?.length > 0) {
        setActiveIndex && setActiveIndex(-1);
      }
    },
    [objUuids, setActiveIndex]
  );

  useEffect(() => {
    if (canvas) {
      canvas.on({
        "selection:cleared": handleChangeActiveObject,
        "selection:updated": handleChangeActiveObject,
        "selection:created": handleChangeActiveObject,
      });
    }
    return () => {
      canvas?.off({
        "selection:cleared": handleChangeActiveObject,
        "selection:updated": handleChangeActiveObject,
        "selection:created": handleChangeActiveObject,
      });
    };
  }, [canvas, handleChangeActiveObject]);
  return <></>;
};
