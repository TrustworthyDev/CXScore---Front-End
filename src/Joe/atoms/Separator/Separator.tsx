import clsx from "clsx";
import React from "react";
import { Box, BoxProps } from "../Box";

export type SeparatorProps = {
  direction?: "horizontal" | "vertical";
} & BoxProps;

export const Separator: React.FC<SeparatorProps> = ({
  direction = "horizontal",
  className,
  ...boxProps
}) => {
  return (
    <Box
      className={clsx(
        "border-0 border-black/[0.39]",
        direction === "horizontal"
          ? "h-0 w-full border-t"
          : "h-full w-0 border-l",
        className
      )}
      {...boxProps}
    />
  );
};
