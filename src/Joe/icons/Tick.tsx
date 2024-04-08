import * as React from "react";

const TickIcon = (props: CustomSVGIconProps) => (
  <svg
    width={21}
    height={18}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M17.042.518 15.207 2.43l-7.39 7.386-2.154-2.072L3.749 5.83 0 9.577l1.914 1.913 3.988 3.985 1.835 1.913 1.914-1.913 9.305-9.299 1.914-1.912L17.042.518Z"
      fill="#6BBDDC"
    />
  </svg>
);

export default TickIcon;
