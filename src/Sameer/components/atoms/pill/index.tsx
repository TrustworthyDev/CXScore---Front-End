import clsx from "clsx";
import React, { PropsWithChildren } from "react";

interface PillProps {
  className?: string;
}

export const Pill = (props: PropsWithChildren<PillProps>) => {
  return (
    <div
      className={clsx(
        `flex w-full items-center justify-center rounded-full border
         border-gray-300 bg-gray-100 px-4 py-2 uppercase`,
        props.className
      )}
    >
      {props.children}
    </div>
  );
};
