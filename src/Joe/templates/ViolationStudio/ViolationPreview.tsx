import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Text } from "@/atoms/Text";
import clsx from "clsx";
import { fetchImgWithAuthentication } from "@/utils";
import { lockObject } from "@/fabric/utils";
import { createViolationBoundRectObject } from "@/fabric/boundRect/BoundRect.func";
import { fabric } from "fabric";
import RelativeToCanvasObject from "@/fabric/RelativeCanvasObject";
import { useFabricRerender } from "@/fabric/useFabricRerender";
import { Card } from "@/atoms/Card";
import { CanvasObjectType, ViolationType } from "@/types/enum";
import ValidationStudioContext from "./ValidationStudioContext";
import { ActionIcon, Tooltip } from "@mantine/core";
import FitToOrigin from "~/icons/FitToOrigin";
import FitToScreen from "~/icons/FitToScreen";

export type ViolationPreviewProps = CanvasElementProps & {
  className?: string;
  validationObjs?: ApiViolation[];
  scrollRef?: React.RefObject<HTMLDivElement>;
  showManual?: boolean;
  showAutomated?: boolean;
};

// const authToken =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhY2Nlc3Nib3QuaW8iLCJpYXQiOjE2NjUzNTUxOTF9.cFwegyUP8C6RCOVLw027Q3NMT_S-lRq2pv-GvkZhr9s";

type ValidationBoundBox = {
  uuid: string;
  validation: ApiViolation;
};

export const ViolationPreview: React.FC<ViolationPreviewProps> = ({
  canvas,
  validationObjs,
  scrollRef,
  showManual,
  showAutomated,
}) => {
  const creationRef = useRef(false);
  const [boundObjects, setBoundObjects] = useState<ValidationBoundBox[]>([]);
  const {
    activeItem: { activeValidation, activeRule },
    setActiveItem,
  } = useContext(ValidationStudioContext);
  const [isFitOrigin, setIsFitOrigin] = useState(false);
  const changeCanvasZoom = useCallback((isFitOrigin: boolean) => {
    const prevZoom = canvas?.getZoom() || 1;
    if (!isFitOrigin) {
      const zoom =
        ((scrollRef?.current?.clientWidth || 0) - 10) /
        ((canvas?.getWidth() || 1) / prevZoom);
      canvas?.setZoom(zoom);
    } else {
      canvas?.setZoom(1);
    }
    const nextZoom = canvas?.getZoom() || 1;
    canvas?.setWidth(((canvas?.getWidth() || 1) / prevZoom) * nextZoom);
    canvas?.setHeight(((canvas?.getHeight() || 1) / prevZoom) * nextZoom);
    canvas?.requestRenderAll();

  }, [canvas, scrollRef]);

  const handleChangeFit = useCallback(() => {
    setIsFitOrigin((v) => !v);
    changeCanvasZoom(!isFitOrigin);
  }, [canvas, isFitOrigin, scrollRef]);

  useEffect(() => {
    initializeDraw();
  }, [canvas, validationObjs, handleChangeFit]);

  const initializeDraw = async () => {
    if (
      !canvas ||
      !validationObjs ||
      validationObjs.length === 0 ||
      boundObjects.length > 0 ||
      creationRef.current === true
    ) {
      return;
    }
    creationRef.current = true;

    const snapshotUrl = validationObjs[0].snapshotUrl;
    const snapshotImage = await fetchImgWithAuthentication(snapshotUrl);
    const image = new Image();
    image.src = snapshotImage;
    image.onload = async () => {
      canvas.setDimensions({ width: image.width, height: image.height });

      const boundObjUUIDs = await Promise.all(
        validationObjs.map(
          ({ bounds, rule }, ind) =>
            bounds &&
            rule &&
            bounds.w + bounds.h > 0 &&
            createViolationBoundRectObject({
              canvas,
              rect: bounds,
              labelText: (ind + 1).toString(),
              violationType: rule.type,
            })
        )
      );
      setBoundObjects(
        boundObjUUIDs
          .map((uuid, ind) => ({
            uuid: uuid || "",
            validation: validationObjs[ind],
          }))
          .filter(({ uuid }) => uuid !== "")
      );

      fabric.Image.fromURL(snapshotImage, async (image) => {
        const snapshotImage = image.set({ left: 0, top: 0 });
        lockObject(snapshotImage, false);
        await canvas.add(snapshotImage);
        snapshotImage.sendToBack();
      });
      changeCanvasZoom(isFitOrigin);
    };
  };
  const hoveredObject = canvas?._hoveredObject;
  const toolTip = useMemo(() => {
    if (!hoveredObject) {
      return;
    }
    const boundObj = boundObjects.find(
      ({ uuid }) => uuid === hoveredObject.uuid
    );
    if (!boundObj) {
      return;
    }
    if (
      (hoveredObject.left ?? 0) + 20 <
      (scrollRef?.current?.scrollLeft ?? 0)
    ) {
      return;
    }
    if ((hoveredObject.top ?? 0) + 20 < (scrollRef?.current?.scrollTop ?? 0)) {
      return;
    }
    // eslint-disable-next-line consistent-return
    return (
      <RelativeToCanvasObject
        object={hoveredObject}
        scrollOffsetX={scrollRef?.current?.scrollLeft}
        scrollOffsetY={scrollRef?.current?.scrollTop}
        verticalOffsetToObject={35}
        zIndex={100}
        zoomLevel={canvas.getZoom()}
      >
        <Card
          variant="full-rounded"
          noBorder
          className={clsx(
            "w-[400px] p-4",
            boundObj.validation.rule?.type === ViolationType.automated
              ? "bg-red-500"
              : "bg-blue-500"
          )}
        >
          <Text variant="h3" className="font-bold">
            {boundObj.validation.rule?.detailSuccessCriteria}
          </Text>
          <Text>{boundObj.validation.rule?.description}</Text>
        </Card>
      </RelativeToCanvasObject>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boundObjects, hoveredObject, scrollRef, isFitOrigin, canvas]);

  const handleTestTypeVisible = () => {
    canvas?.getObjects().forEach((obj) => {
      if (obj.type !== CanvasObjectType.BoundRect) {
        return;
      }
      const boundObj = obj as fabric.BoundRect;
      boundObj.violationType === ViolationType.automated &&
        boundObj.set({ visible: showAutomated });
      boundObj.violationType === ViolationType.manual &&
        boundObj.set({ visible: showManual });
    });
    const activeObj = canvas?.getActiveObject() as fabric.BoundRect;
    if (activeObj?.type === CanvasObjectType.BoundRect) {
      ((activeObj.violationType === ViolationType.automated &&
        !showAutomated) ||
        (activeObj.violationType === ViolationType.manual && !showManual)) &&
        canvas?.discardActiveObject();
    }
    canvas?.renderAll();
  };

  useEffect(() => {
    if (boundObjects.length === 0 || !canvas) {
      return;
    }

    if (activeRule === "" || activeValidation === "") {
      handleTestTypeVisible();
      canvas.discardActiveObject();
      canvas?.renderAll();
      return;
    }
    boundObjects.forEach((obj) =>
      canvas
        .getObjectByUUID(obj.uuid)
        ?.set({ visible: obj.validation.id === activeValidation })
    );

    const targetObj = boundObjects.find(
      ({ validation }) => validation.id === activeValidation
    );
    if (!targetObj) {
      return;
    }
    const targetCanvasObj = canvas.getObjectByUUID(targetObj.uuid);
    if (!targetCanvasObj) {
      return;
    }
    if (targetCanvasObj === canvas.getActiveObject()) {
      canvas?.renderAll();
      return;
    }
    scrollRef?.current?.scrollTo({
      left: targetCanvasObj.left,
      top: targetCanvasObj.top,
    });
    canvas.setActiveObject(targetCanvasObj);
    canvas?.renderAll();
  }, [activeValidation, activeRule, boundObjects, canvas]);

  useEffect(() => {
    if (canvas) {
      canvas.on({
        "selection:updated": handleChangeActiveObject,
        "selection:created": handleChangeActiveObject,
      });
    }
    return () => {
      canvas?.off({
        "selection:updated": handleChangeActiveObject,
        "selection:created": handleChangeActiveObject,
      });
    };
  }, [canvas, boundObjects]);

  const handleChangeActiveObject = (e: fabric.SelectionEvent) => {
    const { selected, deselected } = e;
    if (selected.length > 0) {
      const selectedObj = boundObjects.find(
        ({ uuid }) => uuid === selected[0].uuid
      );
      if (!selectedObj) {
        return;
      }
      const { validation: selectedValidation } = selectedObj;
      if (activeRule === "" || selectedValidation.id !== activeValidation) {
        setActiveItem &&
          setActiveItem({
            activeRule: selectedValidation.ruleId,
            activeValidation: selectedValidation.id,
          });
      }
      return;
    }
    if (deselected.length > 0) {
      if (activeRule !== "") {
        setActiveItem &&
          setActiveItem({ activeRule: "", activeValidation: "" });
      }
    }
  };

  useEffect(() => {
    handleTestTypeVisible();
    setActiveItem && setActiveItem({ activeRule: "", activeValidation: "" });
  }, [showManual, showAutomated]);

  useFabricRerender("custom:canvas:hover:change", canvas);

  return (
    <>
      <Tooltip
        label={isFitOrigin ? "Fit to screen" : "Fit to origin"}
        position="bottom"
        transitionProps={{ transition: "fade", duration: 300 }}
      >
        <ActionIcon
          aria-label="Zoom control button"
          style={{ position: "absolute", top: 10, left: 10, zIndex: 10000 }}
          onClick={handleChangeFit}
        >
          {isFitOrigin ? <FitToScreen noShadow /> : <FitToOrigin noShadow />}
        </ActionIcon>
      </Tooltip>
      {toolTip}
    </>
  );
};
