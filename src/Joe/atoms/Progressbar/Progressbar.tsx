import clsx from "clsx";
import React from "react";
import { Box, BoxProps } from "../Box";

export type ProgressbarProps = {
  value: number;
} & BoxProps;

export const Progressbar: React.FC<ProgressbarProps> = ({
  value,
  className,
  ...boxProps
}) => {
  return (
    <Box
      className={clsx(
        "h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700",
        className
      )}
      {...boxProps}
    >
      <Box
        className="h-full rounded-full bg-blue-600"
        style={{ width: `${(value * 100).toFixed(0)}%` }}
      ></Box>
    </Box>
  );
};
