import React from "react";
import clsx from "clsx";
import { Box, BoxProps } from "../Box";

export type TextProps = BoxProps & {
  children?: React.ReactNode;
  variant?: "h1" | "h2" | "h3" | "large" | "body" | "small" | "tiny";
  color?: "primary" | "secondary" | "tertiary" | "success";
  wordBreak?: "break-normal" | "break-words" | "break-all" | "break-keep";
  uppercase?: boolean;
  capitalize?: boolean;
};

const textConfig = {
  h1: "text-3xl",
  h2: "text-2xl",
  h3: "text-xl",
  large: "text-lg",
  body: "text-base",
  small: "text-sm",
  tiny: "text-xs",
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
  success: "text-success",
  "break-normal": "break-normal",
  "break-words": "break-words",
  "break-all": "break-all",
  "break-keep": "break-keep",
};

export const Text: React.FC<TextProps> = ({
  variant = "body",
  color = "primary",
  wordBreak = "break-normal",
  className,
  children,
  uppercase,
  capitalize,
  ...boxProps
}) => {
  return (
    <Box
      className={clsx(
        textConfig[variant],
        textConfig[color],
        textConfig[wordBreak],
        className,
        uppercase && "uppercase",
        capitalize && "capitalize"
      )}
      {...boxProps}
    >
      {children}
    </Box>
  );
};
