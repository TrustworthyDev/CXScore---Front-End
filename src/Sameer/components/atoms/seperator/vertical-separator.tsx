import clsx from "clsx";
import { PropsWithChildren } from "react";

interface SeparatorProps {
  className?: string;
}

export const VerticalSeparator = (props: PropsWithChildren<SeparatorProps>) => {
  return (
    <div
      role="presentation"
      className={clsx("h-full bg-gray-300", props.className)}
      style={{
        width: "1px",
      }}
    />
  );
};
