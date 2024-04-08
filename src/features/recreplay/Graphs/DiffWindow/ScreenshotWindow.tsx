import { useContext, useEffect, useRef, useState } from "react";
import SnapshotContext from "../contexts/SnapshotContext";
import { Box, ScrollArea, Stack, Text, rem } from "@mantine/core";
import { getNodeByPath } from "../Graph.utils";

export function ScreenshotWindow() {
  const context = useContext(SnapshotContext);
  const { screenshot, snapshot, selectedPath, activeAnnotations } =
    context || {};

  const [boundStr, setBoundStr] = useState("");

  const canvasParentRef = useRef(null);
  const canvasRef = useRef(null);

  const [image, setImage] = useState<any>(null);
  // const [box, setBox] = useState<number[]|null>(null);

  const drawContent = (
    img: any,
    box?: number[] | null,
    an?: Record<string, DomNodeAnnotation>
  ) => {
    const canvas: any = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");

    if (img == null) {
      return;
    }
    console.log("clear canvas");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    console.log("fresh image");

    if (an) {
      for (const [k, a] of Object.entries(an)) {
        for (let i = 0; i < a.data.length; i++) {
          const d = a.data[i];
          const box = d.bounds;
          if (box) {
            const color = a.color || "green";
            // console.log('paint bound ', box);
            const [x, y, w, h] = box;
            ctx.beginPath();

            ctx.lineWidth = 5;
            ctx.strokeStyle = color;
            ctx.rect(x, y, w, h);
            ctx.stroke();

            if (a.type == "multiple") {
              ctx.beginPath();
              ctx.fillStyle = color;
              ctx.arc(x, y, 20, 0, 2 * Math.PI, false);
              ctx.fill();

              ctx.font = "25px Arial";
              ctx.fillStyle = "white";
              ctx.textAlign = "center";
              ctx.fillText((i + 1).toString(), x, y + 5);
              ctx.stroke();

              if (d.name) {
                ctx.fillStyle = a.color || "green";
                ctx.textAlign = "left";
                ctx.font = "18px Arial";
                const label = d.name.substring(0, 20);
                ctx.fillText(label, x, y + 25);
              }
            }
          }
        }
      }
    }
    if (box) {
      // console.log('paint bound ', box);
      const [x, y, w, h] = box;
      ctx.beginPath();

      ctx.lineWidth = 5;
      ctx.strokeStyle = "red";
      ctx.rect(x, y, w, h);
      ctx.stroke();
    }
  };

  useEffect(() => {
    const canvas: any = canvasRef.current;
    if (!canvas) {
      return;
    }
    console.log("in use effect, canvas non null");

    const img: any = new Image();
    img.src = `data:image/png;base64,${screenshot}`;
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      drawContent(img);
    };
    setImage(img);
  }, [screenshot]);

  useEffect(() => {
    console.log("in draw box effect");
    setBoundStr("");
    console.log("in use effect, canvas non null, selectedPath: ", selectedPath);
    const n = getNodeByPath(snapshot, selectedPath);
    if (!n) {
      drawContent(image);
      return;
    }
    console.log("in draw box effect, found n");
    if (!n.bounds) {
      drawContent(image);
      return;
    }
    console.log("in draw box effect, got bound");
    setBoundStr(`${n.bounds[0]} ${n.bounds[1]} ${n.bounds[2]} ${n.bounds[3]}`);

    const canvasParent: any = canvasParentRef.current;
    if (canvasParent) {
      let scrollTop = n.bounds[1] - 50;
      if (scrollTop < 0) {
        scrollTop = 0;
      }
      console.log("scroll canvas to ", scrollTop);
      canvasParent.scrollTop = scrollTop;

      let scrollLeft = n.bounds[0] - 50;
      if (scrollLeft < 0) {
        scrollLeft = 0;
      }
      console.log("scroll canvas left to ", scrollLeft);
      canvasParent.scrollLeft = scrollLeft;
    }
    drawContent(image, n.bounds, activeAnnotations);
  }, [selectedPath, snapshot]);

  useEffect(() => {
    if (!activeAnnotations) {
      return;
    }
    const canvas: any = canvasRef.current;
    if (!canvas) {
      return;
    }
    // TODO: should draw the box too, or included in active annotations
    drawContent(image, null, activeAnnotations);
  }, [activeAnnotations]);

  if (!screenshot) {
    return (
      <Box m="xs">
        <Text>No screenshot loaded</Text>
      </Box>
    );
  }

  return (
    <Box w="100%">
      <Stack>
        <Text display="block">
          {image
            ? `Image width: ${image.width}, height: ${image.height}`
            : "No image loaded"}
        </Text>
        <Text display="block">
          {boundStr
            ? `Selected element bound: ${boundStr}`
            : "No element selected or no bound"}
        </Text>
      </Stack>
      <ScrollArea type="always" w="100%" h={rem(800)}>
        <div
          ref={canvasParentRef}
          style={{
            height: "calc(100% - 60px)",
            overflow: "scroll",
            overflowX: "scroll",
          }}
        >
          <canvas
            style={{ maxHeight: "8000", maxWidth: "8000" }}
            ref={canvasRef}
          />
        </div>
      </ScrollArea>
    </Box>
  );
  // return <canvas ref={canvasRef} style={{width: "100vw", height: "100vh"}}/>;
}
