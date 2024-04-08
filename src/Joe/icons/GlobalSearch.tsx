import { ReactElement } from "react";
export const GlobalSearchIcon = ({
  fill,
  size,
  ...props
}: CustomSVGIconProps & { size: number }): ReactElement => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_1_155)">
        <path
          d="M13.75 7.5C13.75 4.05 10.95 1.25 7.5 1.25C4.05 1.25 1.25 4.05 1.25 7.5C1.25 10.95 4.05 13.75 7.5 13.75"
          stroke="#545454"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M5 1.875H5.625C4.40625 5.525 4.40625 9.475 5.625 13.125H5"
          stroke="#545454"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M9.375 1.875C9.98125 3.7 10.2875 5.6 10.2875 7.5"
          stroke="#545454"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M1.875 10V9.375C3.7 9.98125 5.6 10.2875 7.5 10.2875"
          stroke="#545454"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M1.875 5.62506C5.525 4.40631 9.475 4.40631 13.125 5.62506"
          stroke="#545454"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M11.375 13.375C12.4796 13.375 13.375 12.4796 13.375 11.375C13.375 10.2704 12.4796 9.375 11.375 9.375C10.2704 9.375 9.375 10.2704 9.375 11.375C9.375 12.4796 10.2704 13.375 11.375 13.375Z"
          stroke="#545454"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M13.75 13.75L13.125 13.125"
          stroke="#545454"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1_155">
          <rect width="15" height="15" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
