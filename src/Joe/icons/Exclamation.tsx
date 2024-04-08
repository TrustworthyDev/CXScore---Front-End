import React, { ReactElement } from "react";

export const Exclamation = ({ fill }: TempIconProps): ReactElement => {
  return (
    <svg
      width="5"
      height="18"
      viewBox="0 0 5 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.794824 3.85V0.499999H4.19482V3.85L3.79482 12.95H1.19482L0.794824 3.85ZM0.569824 16.925V15.425L1.64482 14.35H3.34482L4.41982 15.425V16.925L3.34482 18H1.64482L0.569824 16.925Z"
        fill={fill || "#FDD819"}
      />
      <defs>
        <linearGradient
          x1="-1"
          y1="0"
          x2="11.1609"
          y2="4.72922"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FDD819" />
          <stop offset="1" stopColor="#E80505" />
        </linearGradient>
      </defs>
    </svg>
  );
};
