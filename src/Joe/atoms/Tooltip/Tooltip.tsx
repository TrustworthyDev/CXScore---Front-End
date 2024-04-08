import React from "react";
import { Box } from "../Box";
import clsx from "clsx";

export type TooltipProps = {
  message: React.ReactNode | string;
  children: React.ReactNode;
  messageStyle?: string;
  className?: string;
  placement?: "top" | "left" | "right" | "bottom";
};

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  message,
  placement = "bottom",
  messageStyle,
  className,
}) => {
  return (
    <Box className={clsx("group relative flex", className)}>
      {children}
      <span
        className={clsx(
          "absolute top-full z-40 mt-1 origin-top-left scale-0 transition-all group-hover:scale-100",
          messageStyle
        )}
      >
        {message}
      </span>
    </Box>
  );
};
