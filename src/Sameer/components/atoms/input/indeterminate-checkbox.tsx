import clsx from "clsx";
import React, { HTMLProps } from "react";

export const IndeterminateCheckbox = ({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) => {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={clsx(
        className,
        rest.disabled ? "cursor-not-allowed" : "cursor-pointer"
      )}
      {...rest}
    />
  );
};
