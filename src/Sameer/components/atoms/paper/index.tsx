import clsx from "clsx";
import React, { PropsWithChildren } from "react";

interface PaperProps {
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export const Paper = (props: PropsWithChildren<PaperProps>) => {
  return (
    <div
      ref={props.ref}
      className={clsx(
        // "rounded-tr-xl rounded-bl-xl",
        "border border-gray-300 bg-slate-50 p-4",
        props.className
      )}
    >
      {props.children}
    </div>
  );
};
