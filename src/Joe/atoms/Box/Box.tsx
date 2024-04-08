import React, { forwardRef } from "react";
import clsx from "clsx";

export type BoxProps = {
  children?: React.ReactNode;
  flex?: boolean;
  flexDirection?: "row" | "col" | "row-reverse" | "col-reverse";
} & React.HTMLAttributes<HTMLDivElement>;
const boxConfig = {
  row: "flex flex-row",
  "row-reverse": "flex flex-row-reverse",
  col: "flex flex-col",
  "col-reverse": "flex flex-colo-reverse",
};

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  (
    { flex = false, flexDirection = "row", className, children, ...divProps },
    ref
  ) => {
    return (
      <div
        className={clsx(flex && boxConfig[flexDirection], className)}
        ref={ref}
        {...divProps}
      >
        {children}
      </div>
    );
  }
);
