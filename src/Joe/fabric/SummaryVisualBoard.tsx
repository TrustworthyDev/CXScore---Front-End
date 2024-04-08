import { Box } from "@/atoms/Box";
import React, { useEffect, useRef, useState } from "react";
import BoardCanvas from "./BoardCanvas";
import createViolationCanvas from "./ViolationCanvas";

export type SummaryCanvasElementProps = CanvasElementProps & {
  validationObjs: ApiViolation[];
};

export type SummaryVisualBoardProps = {
  CanvasElement: (props: SummaryCanvasElementProps) => React.ReactElement | any;
  elementProps?: any;
};

export const SummaryVisualBoard: React.FC<SummaryVisualBoardProps> = ({
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
    <Box>
      <BoardCanvas ref={canvasDomRef} />
      <CanvasElement canvas={canvasRef} {...elementProps} />
    </Box>
  );
};
