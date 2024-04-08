import React, { ReactElement } from "react";

export const CircleUp = (props: CustomSVGIconProps): ReactElement => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#767676"
      {...props}
    >
      <g clipPath="url(#clip0_510_2202)">
        <path
          d="M10.0002 1.66665C5.39766 1.66665 1.66683 5.39748 1.66683 9.99998C1.66683 14.6025 5.39766 18.3333 10.0002 18.3333C14.6027 18.3333 18.3335 14.6025 18.3335 9.99998C18.3335 5.39748 14.6027 1.66665 10.0002 1.66665Z"
          stroke="inherit"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.9419 11.05L10.0002 8.11665L7.05856 11.05"
          stroke="inherit"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath>
          <rect
            width="20"
            height="20"
            fill="white"
            transform="matrix(-1 0 0 -1 20 20)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
