import { Box } from "@/atoms/Box";
import { useRef } from "react";

export const repositionRelativeElementsEvent = "repositionRelativeElements";

type RelativeToCanvasObjectProps = {
  object: fabric.Object;
  round?: boolean;
  verticalOffsetToObject: number;
  scrollOffsetX?: number;
  scrollOffsetY?: number;
  zIndex: number;
  children?: React.ReactNode;
  zoomLevel?: number;
};

const RelativeToCanvasObject: React.FC<RelativeToCanvasObjectProps> = ({
  children,
  object,
  verticalOffsetToObject,
  zIndex,
  scrollOffsetX = 0,
  scrollOffsetY = 0,
  zoomLevel = 1,
}: RelativeToCanvasObjectProps) => {
  const dialogElRef = useRef<HTMLDivElement | null>(null);
  return (
    <Box
      ref={dialogElRef}
      // style={{
      //   transform: toolbarDimensions.isOnScreen
      //     ? `translate(${toolbarDimensions.translateX}px, ${toolbarDimensions.translateY}px)`
      //     : "translate(-200px, -200px)",
      // }}
      style={{
        position: "absolute",
        top:
          (object.top ?? 0) * zoomLevel +
          verticalOffsetToObject -
          scrollOffsetY,
        left: (object.left ?? 0) * zoomLevel - scrollOffsetX,
        zIndex,
      }}
      className="animate-[fadeIn_400ms_ease-in-out]"
    >
      {children}
    </Box>
  );
};

export default RelativeToCanvasObject;
