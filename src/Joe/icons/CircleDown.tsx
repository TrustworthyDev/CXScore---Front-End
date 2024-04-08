import React, { ReactElement } from "react";

export const CircleDown = ({
  className,
  stroke = "#767676",
  ...rest
}: {
  className?: string;
  stroke?: string;
} & React.SVGProps<SVGSVGElement>): ReactElement => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      stroke={stroke}
      {...rest}
    >
      <g clipPath="url(#clip0_510_2062)">
        <path
          d="M9.99984 18.3334C14.6023 18.3334 18.3332 14.6025 18.3332 10C18.3332 5.39752 14.6023 1.66669 9.99984 1.66669C5.39734 1.66669 1.6665 5.39752 1.6665 10C1.6665 14.6025 5.39734 18.3334 9.99984 18.3334Z"
          stroke="inherit"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        />
        <path
          d="M7.05811 8.95001L9.99977 11.8833L12.9414 8.95001"
          stroke="inherit"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        />
      </g>
      <defs>
        <clipPath>
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
