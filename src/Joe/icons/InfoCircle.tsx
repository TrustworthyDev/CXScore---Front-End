import { ReactElement } from "react";
export const InfoCircleIcon = ({
  fill,
  size,
  ...props
}: CustomSVGIconProps & { size: number }): ReactElement => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#545454"
      {...props}
    >
      <path
        d="M11 7.33334V11.9167M11 20.1667C16.0417 20.1667 20.1667 16.0417 20.1667 11C20.1667 5.95834 16.0417 1.83334 11 1.83334C5.95834 1.83334 1.83334 5.95834 1.83334 11C1.83334 16.0417 5.95834 20.1667 11 20.1667Z"
        stroke-opacity="0.45"
        stroke="inherit"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10.9954 14.6667H11.0044"
        stroke="inherit"
        stroke-opacity="0.45"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
