type IconProps = {
  alignMiddle?: boolean;
  clickable?: boolean;
  context?: boolean;
  disabled?: boolean;
  fill?: string;
  margin?: string | number;
  noShadow?: boolean;
  scale?: number;
  // false - scales the icon itself, within its viewbox
  // true - scales the icon along with its viewbox
  scaleViewBox?: boolean;
  themed?: boolean;
  viewBox?: string;
  width?: string;
  height?: string;
  styles?: import("@mantine/core").CSSObject;
  onClick?: () => void;
  className?: string;
  variant?: string;
  children?: React.ReactNode;
};
