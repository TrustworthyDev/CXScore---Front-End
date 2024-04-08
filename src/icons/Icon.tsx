import { Box, BoxProps } from "@mantine/core";
import React, { ReactElement } from "react";

type Props = IconProps & BoxProps;

export function Icon({
  clickable,
  noShadow,
  context,
  alignMiddle,
  scale,
  scaleViewBox,
  disabled,
  margin,
  themed,
  styles,
  children,
  ...svgProps
}: Props): ReactElement {
  const clickableStyles = {
    cursor: "pointer",
    pointerEvents: "auto",
  };

  return (
    <Box
      component="svg"
      viewBox="0 0 40 40"
      style={{
        ...(clickable ? clickableStyles : undefined),
        backgroundColor: "transparent",
        display: "inline-block",
        filter:
          context || noShadow
            ? "none"
            : "drop-shadow(4px 4px 4px hsla(0, 0%, 0%, 0.5))",
        height: "20px",
        outline: "none",
        stroke: "none",
        verticalAlign: alignMiddle ? "middle" : undefined,
        transform: scale ? `scale(${scale})` : undefined,
        flex: scaleViewBox ? "auto" : "none",
        width: "20px",
        pointerEvents: disabled ? "none" : "auto",
        margin: margin ?? undefined,
        color: "inherit",
        fill: themed ? "var(--textColor)" : undefined,
        ...styles,
      }}
      {...svgProps}
    >
      {children}
    </Box>
  );
}
