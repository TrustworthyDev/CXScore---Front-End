import React, { ReactElement } from "react";

export const Pass = ({ fill }: TempIconProps): ReactElement => {
  return (
    <svg
      width="19"
      height="15"
      viewBox="0 0 19 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 8.62377L2.23753 6.37146L6.33597 10.4954L16.7625 0L19 2.25231L6.33439 15L0 8.62377Z"
        fill={fill || "url(#paint0_linear_547_1862)"}
      />
      <defs>
        <linearGradient
          id="paint0_linear_547_1862"
          x1="0"
          y1="0"
          x2="14.5904"
          y2="18.4812"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2AFADF" />
          <stop offset="1" stopColor="#4C83FF" />
        </linearGradient>
      </defs>
    </svg>
  );
};
