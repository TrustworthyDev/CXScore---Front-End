import { forwardRef, ReactElement } from "react";

export default forwardRef<HTMLCanvasElement>(function BoardCanvas(
  _,
  ref
): ReactElement {
  return <canvas className="canvas-ready" ref={ref} style={canvasStyle} />;
});

const canvasStyle: React.CSSProperties = {
  bottom: 0,
  left: 0,
  position: "absolute",
  right: 0,
  top: 0,
  zIndex: 100,
  width: "100%",
  height: "100%",
  touchAction: "none",
};
