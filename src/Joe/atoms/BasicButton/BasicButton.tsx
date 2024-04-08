import React from "react";
import clsx from "clsx";
import { Spinner } from "../Spinner";

export type BasicButtonProps = {
  loading?: boolean;
  rounded?: boolean;
  className?: string;
  color?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "success"
    | "successTwo"
    | "primaryTwo"
    | "primaryThree"
    | "primaryFour"
    | "failure";
  children?: React.ReactNode;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const buttonConfig = {
  primary: "bg-primary text-primary",
  primaryTwo: "bg-[#6A9BB7] text-white",
  primaryThree: "bg-brand-600 text-white",
  primaryFour: "bg-[#35ACEF] text-white",
  secondary: "bg-secondary text-primary",
  tertiary: "bg-tertiary text-primary",
  success: "bg-success text-primary",
  successTwo: "bg-white text-black",
  failure: "bg-[#F86F80] text-white",
};

export const BasicButton: React.FC<BasicButtonProps> = ({
  rounded = true,
  children,
  className,
  color = "primary",
  disabled,
  loading,
  ...htmlBtnProps
}) => {
  return (
    <button
      className={clsx(
        !disabled &&
          !loading &&
          "transition-all hover:drop-shadow-xl active:opacity-[0.85]",
        "px-6 py-2",
        "relative flex items-center justify-center",
        buttonConfig[color],
        rounded && "rounded-2xl",
        (disabled || loading) && "cursor-not-allowed bg-[#BBBBBB]",
        className
      )}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      {...htmlBtnProps}
    >
      {loading && <Spinner className="left-10 mr-2 h-10 w-10" />}
      {children}
    </button>
  );
};
