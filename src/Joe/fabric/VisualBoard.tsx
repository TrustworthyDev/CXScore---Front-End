import { Box } from "@/atoms/Box";
import React, { useEffect, useRef, useState } from "react";
import BoardCanvas from "./BoardCanvas";
import createViolationCanvas from "./ViolationCanvas";

export type VisualBoardProps = {
  CanvasElement: (props: CanvasElementProps) => React.ReactElement | any;
  elementProps?: any;
};

export const VisualBoard: React.FC<VisualBoardProps> = ({
  CanvasElement,
  elementProps,
}) => {
  const canvasDomRef = useRef<HTMLCanvasElement>(null);
  const [canvasRef, setCanvasRef] = useState<fabric.Canvas>();

  useEffect(() => {
    if (!canvasDomRef.current) {
      return;
    }

    const canvas = createViolationCanvas(canvasDomRef.current);
    canvas.setCursor("default");
    canvas.attachHoverEvents();
    setCanvasRef(canvas);
    window.canvas = canvas;

    return () => {
      canvas.dispose();
      delete window.canvas;
    };
  }, []);

  return (
    <Box className="h-[1px] w-[1px]">
      <BoardCanvas ref={canvasDomRef} />
      <CanvasElement canvas={canvasRef} {...elementProps} />
    </Box>
  );
};
