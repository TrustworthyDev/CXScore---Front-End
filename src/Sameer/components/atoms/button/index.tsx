import clsx from "clsx";
import React, { PropsWithChildren } from "react";
import { SmallSpinner } from "../loading";

const BaseStyles = clsx(
  `px-8 py-2 text-center font-display
  font-semibold uppercase shadow-md hover:shadow-lg 
  focus:shadow-lg focus:ring-2 focus:ring-opacity-50`
);

const VariantStyles = {
  default: `bg-white text-gray-800`,
  primary: `bg-brand-600 text-white hover:bg-brand-700 focus:bg-brand-700 focus:ring-brand-700 !bg-[#35ACEF]`,
  secondary: `bg-brand-600 text-white hover:bg-brand-700 focus:bg-brand-700 focus:ring-brand-700`,
  rounded: `rounded-2xl`,
  disabled: `cursor-not-allowed`,
} as const;

interface ButtonProps {
  className?: string;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  variant?: keyof typeof VariantStyles;
  rounded?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

export const Button = ({
  rounded = true,
  disabled = false,
  loading = false,
  ...props
}: PropsWithChildren<ButtonProps>) => {
  const selectedVariant = props.variant || "default";

  return (
    <button
      className={clsx(
        BaseStyles,
        VariantStyles[selectedVariant],
        disabled && VariantStyles.disabled,
        rounded && VariantStyles.rounded,
        props.className
      )}
      disabled={disabled}
      aria-disabled={disabled}
      {...props.buttonProps}
    >
      {!loading ? props.children : <SmallSpinner className="!text-white" />}
    </button>
  );
};
