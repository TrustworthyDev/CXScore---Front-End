import { Box, Center, rem } from "@mantine/core";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { createBoundRectObject } from "@/fabric/boundRect/BoundRect.func";
import { lockObject } from "@/fabric/utils";
import { VisualBoard } from "@/fabric/VisualBoard";
import {
  arrayBufferToBase64,
  fetchImgWithAuthentication,
} from "@/utils/imageUtils";
import { Loading } from "~/Sameer/components/atoms/loading";
import { ACCESSTOKEN_KEY } from "~/Sameer/lib/application/use-login";

type Props = {
  boundingBoxes: Rectangle[];
  snapshotUrl: string;
};

export const customFetchImgWithAuthentication = (
  url: string,
): Promise<string> => {
  const headers = new Headers();
  const authToken = localStorage.getItem(ACCESSTOKEN_KEY);
  headers.set("Authorization", `Bearer ${authToken}`);
  return fetch(`${url}`, { method: "GET", headers })
    .then((res) => res.arrayBuffer())
    .then(arrayBufferToBase64)
    .then((res) => {
      return "data:image/png;base64," + res;
    });
};

export const PerfSnapshot: React.FC<Props> = ({
  boundingBoxes,
  snapshotUrl,
}) => {
  const [snapshotImage, setSnapshotImage] = useState<string>();
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  }>();
  const [containerWidth] = useState(1200);
  const loadSnapshotImage = useCallback((snapshotUrl: string) => {
    // const snapshotUrl =
    //   "d10efc70-df79-4750-9df7-44610b566260/30165bc1-19f7-48ae-9157-d290287af3ff.png";
    fetchImgWithAuthentication(
      `perf/${snapshotUrl}`,
      // authToken
    ).then((base64Image) => {
      setSnapshotImage((img) => img ?? base64Image);
    });
  }, []);
  useEffect(() => {
    if (snapshotUrl) {
      setSnapshotImage(undefined);
      loadSnapshotImage(snapshotUrl);
    }
  }, [loadSnapshotImage, snapshotUrl]);
  useEffect(() => {
    if (!snapshotImage) {
      return;
    }
    const image = new Image();
    image.src = snapshotImage;
    image.onload = async () => {
      setImageSize({ width: image.width, height: image.height });
    };
  }, [snapshotImage]);
  const aspectRatio = imageSize ? imageSize.width / imageSize.height : 1;
  if (!imageSize || !snapshotImage) {
    return (
      <Center w={rem(containerWidth)} h={"calc(80vh)"}>
        <Loading />
      </Center>
    );
  }
  return (
    <Box w={rem(containerWidth)} h={rem(containerWidth / aspectRatio)}>
      <VisualBoard
        CanvasElement={PerfSnapshotCanvas}
        elementProps={{
          snapshotImage,
          imageSize,
          containerWidth,
          boundingBoxes,
        }}
      />
    </Box>
  );
};

type PerfSnapshotCanvasProps = CanvasElementProps & {
  snapshotImage?: string;
  imageSize?: { width: number; height: number };
  containerWidth?: number;
  boundingBoxes?: Rectangle[];
};
const PerfSnapshotCanvas: React.FC<PerfSnapshotCanvasProps> = ({
  canvas,
  snapshotImage,
  imageSize,
  containerWidth,
  boundingBoxes = [],
}) => {
  const creationRef = useRef(false);
  const initializeDraw = useCallback(async () => {
    if (
      !canvas ||
      !snapshotImage ||
      creationRef.current === true ||
      !imageSize ||
      !containerWidth
    ) {
      return;
    }
    creationRef.current = true;

    fabric.Image.fromURL(snapshotImage, async (image) => {
      const snapshotImage = image.set({ left: 0, top: 0 });
      lockObject(snapshotImage, false);
      await canvas.add(snapshotImage);
      snapshotImage.sendToBack();
    });
    await Promise.all(
      boundingBoxes.map((box) =>
        createBoundRectObject({
          canvas,
          rect: box,
          labelText: "",
          color: "red",
          strokeWidth: 4,
        }),
      ),
    );
  }, [boundingBoxes, canvas, containerWidth, imageSize, snapshotImage]);

  useEffect(() => {
    initializeDraw();
  }, [initializeDraw]);

  useEffect(() => {
    if (canvas && containerWidth && imageSize) {
      canvas.setZoom(containerWidth / (imageSize.width + 10));
      const zoom = canvas.getZoom();
      canvas.setWidth((imageSize.width + 10) * zoom);
      canvas.setHeight((imageSize.height + 10) * zoom);
    }
  }, [containerWidth, canvas, imageSize]);
  return <></>;
};
