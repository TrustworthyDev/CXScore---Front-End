import clsx from "clsx";
import React from "react";

export type TextInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const TextInput: React.FC<TextInputProps> = ({
  className = "h-12 border border-black/10",
  ...basicInputProps
}) => {
  return (
    <input
      type="text"
      className={clsx("px-4", className)}
      {...basicInputProps}
    />
  );
};
