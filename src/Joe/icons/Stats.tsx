import { ReactElement } from "react";
export const StatsIcon = ({
  fill,
  size = 13,
  ...props
}: CustomSVGIconProps & { size: number }): ReactElement => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 13 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.87501 3.33333H12.0417V12.8333H0.958344V4.91667H4.12501V0.166668H8.87501V3.33333ZM7.29168 1.75H5.70834V11.25H7.29168V1.75ZM8.87501 4.91667V11.25H10.4583V4.91667H8.87501ZM4.12501 6.5V11.25H2.54168V6.5H4.12501Z"
      fill="#545454"
    />
  </svg>
);
