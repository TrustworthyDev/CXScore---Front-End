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

export type CXSKeyboardAccessibleDetailCanvasProps = CanvasElementProps & {
  scrollRef?: React.RefObject<HTMLDivElement>;
  detailInfo?: CXSKeyboardAccessibleDetail;
  snapshotImage?: string;
};

export const CXSKeyboardAccessibleDetailCanvas: React.FC<
  CXSKeyboardAccessibleDetailCanvasProps
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

      const contentColorConfig = "rgb(219, 39, 119)";
      const fillConfig = "rgba(22, 163, 74, 0.4)";

      setObjUuids(
        await Promise.all(
          [detailInfo.output].map(({ path, rectangle }) =>
            createBoundRectObject({
              canvas,
              rect: rectangle,
              labelText: "",
              color: contentColorConfig,
              fillColor: fillConfig,
              strokeWidth: 3,
              opacity: 1,
            })
          )
        )
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
