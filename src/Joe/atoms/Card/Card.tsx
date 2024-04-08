import React from "react";
import { Box, BoxProps } from "../Box";
import clsx from "clsx";

export type CardProps = {
  children?: React.ReactNode;
  variant?: "custom" | "half-rounded" | "full-rounded";
  dropShadow?: boolean;
  noBorder?: boolean;
  roundedTR?: boolean;
  roundedTL?: boolean;
  roundedBR?: boolean;
  roundedBL?: boolean;
} & BoxProps;

const cardConfig = {
  custom: "",
  "half-rounded": "rounded-tr-2xl rounded-bl-2xl",
  "full-rounded": "rounded-2xl",
};

export const Card: React.FC<CardProps> = ({
  variant = "custom",
  dropShadow = false,
  noBorder,
  roundedTL,
  roundedTR,
  roundedBL,
  roundedBR,
  className,
  children,
  ...boxProps
}) => {
  return (
    <Box
      className={clsx(
        noBorder ? "border-0" : "border border-black/10",
        cardConfig[variant],
        roundedTL && "rounded-tl-2xl",
        roundedTR && "rounded-tr-2xl",
        roundedBL && "rounded-bl-2xl",
        roundedBR && "rounded-br-2xl",
        dropShadow && "shadow-xl",
        className
      )}
      {...boxProps}
    >
      {children}
    </Box>
  );
};
