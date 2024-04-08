import { ReactElement } from "react";
export const TrashIcon = ({
  fill,
  size,
  ...props
}: CustomSVGIconProps & { size: number }): ReactElement => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.25 3.48866C10.3075 3.29616 8.35333 3.19699 6.405 3.19699C5.25 3.19699 4.095 3.25533 2.94 3.37199L1.75 3.48866M4.95833 2.89949L5.08667 2.13533C5.18 1.58116 5.25 1.16699 6.23583 1.16699H7.76417C8.75 1.16699 8.82583 1.60449 8.91333 2.14116L9.04167 2.89949M10.9958 5.33199L10.6167 11.2062C10.5525 12.122 10.5 12.8337 8.8725 12.8337H5.1275C3.5 12.8337 3.4475 12.122 3.38333 11.2062L3.00417 5.33199M6.02583 9.62533H7.96833M5.54167 7.29199H8.45833"
        stroke={fill}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
