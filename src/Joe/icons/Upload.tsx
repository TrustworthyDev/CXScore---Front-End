import React, { ReactElement } from "react";

// use tailwind fill for color
export const UploadIcon = ({
  className,
}: {
  className?: string;
}): ReactElement => {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 37 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M20.6758 15.4473L20.6758 29.4473"
        stroke="#323232"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25.3008 19.2207L20.8099 14.123C20.7359 14.039 20.6157 14.039 20.5417 14.123L16.0508 19.2207"
        stroke="#323232"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.70703 26.0684V27.8787V33.3097C8.70703 35.3094 9.89801 36.9304 11.3672 36.9304H29.9881C31.4573 36.9304 32.6482 35.3094 32.6482 33.3097V27.8787V26.0684"
        stroke="#323232"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
