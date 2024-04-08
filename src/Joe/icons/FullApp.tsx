import { ReactElement } from "react";

export const FullApp = ({
  fill,
  stroke,
  size,
  ...props
}: CustomSVGIconProps & { size: number }): ReactElement => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 123 123"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      aria-label="Full-App-Icon"
    >
      <g clipPath="url(#clip0_1952_3845)">
        <path
          d="M79.4375 89.6875H12.8125V48.6875"
          stroke={stroke}
          strokeWidth={5}
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M38.4375 23.0625H99.9375V64.0625"
          stroke={stroke}
          strokeWidth={5}
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M53.8125 89.6875V110.188"
          stroke={stroke}
          strokeWidth={5}
          strokeMiterlimit={10}
          strokeLinejoin="round"
        />
        <path
          d="M33.3125 110.188H74.3125"
          stroke={stroke}
          strokeWidth={5}
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.8125 74.3125H79.4375"
          stroke={stroke}
          strokeWidth={5}
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M28.1875 2.5625H2.5625V38.4375H28.1875V2.5625Z"
          stroke={stroke}
          strokeWidth={5}
          strokeMiterlimit={10}
          strokeLinejoin="round"
        />
        <path
          d="M120.438 74.3125H89.6875V120.438H120.438V74.3125Z"
          stroke={stroke}
          strokeWidth={5}
          strokeMiterlimit={10}
          strokeLinejoin="round"
        />
        <path
          d="M12.8125 28.1875H17.9375"
          stroke={stroke}
          strokeWidth={5}
          strokeMiterlimit={10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M89.6875 110.188H120.438"
          stroke={stroke}
          strokeWidth={5}
          strokeMiterlimit={10}
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1952_3845">
          <rect width={123} height={123} fill={fill} />
        </clipPath>
      </defs>
    </svg>
  );
};
