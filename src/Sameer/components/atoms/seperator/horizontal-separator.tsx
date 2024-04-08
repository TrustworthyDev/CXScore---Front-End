import clsx from "clsx";
import React, { PropsWithChildren } from "react";

interface SeparatorProps {
  className?: string;
}

export const HorizontalSeparator = (
  props: PropsWithChildren<SeparatorProps>
) => {
  return (
    <div
      role="presentation"
      className={clsx("bg-gray-300", props.className)}
      style={{
        height: "1px",
        width: "100%",
      }}
    />
  );
};
