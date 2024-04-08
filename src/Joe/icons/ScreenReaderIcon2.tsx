import { ReactElement } from "react";
export const ScreenReaderIcon2 = ({
  fill,
  size = 17,
  ...props
}: CustomSVGIconProps & { size: number }): ReactElement => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.5 14.8333H11.6667M8.5 14.8333H5.33333M8.5 14.8333V11.6667H2.95833C2.52111 11.6667 2.16667 11.3122 2.16667 10.875V6.125M1.375 1.375L15.625 15.625M14.8333 3.75C14.8333 3.31278 14.4789 2.95833 14.0417 2.95833H6.91667M14.8333 6.91667V10.875"
      stroke="#545454"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
