import { ReactElement } from "react";
export const PlusIcon = ({ size }: { size: number }): ReactElement => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="plus-square-svgrepo-com 1" clip-path="url(#clip0_2708_1154)">
        <g id="Page-1">
          <g id="Icon-Set-Filled">
            <path
              id="plus-square"
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M15.125 10.3125H11.6875V6.875C11.6875 6.49687 11.3795 6.1875 11 6.1875C10.6205 6.1875 10.3125 6.49687 10.3125 6.875V10.3125H6.875C6.4955 10.3125 6.1875 10.6219 6.1875 11C6.1875 11.3781 6.4955 11.6875 6.875 11.6875H10.3125V15.125C10.3125 15.5031 10.6205 15.8125 11 15.8125C11.3795 15.8125 11.6875 15.5031 11.6875 15.125V11.6875H15.125C15.5045 11.6875 15.8125 11.3781 15.8125 11C15.8125 10.6219 15.5045 10.3125 15.125 10.3125ZM19.25 22H2.75C1.23131 22 0 20.7694 0 19.25V2.75C0 1.23063 1.23131 0 2.75 0H19.25C20.7687 0 22 1.23063 22 2.75V19.25C22 20.7694 20.7687 22 19.25 22Z"
              fill="#1446FF"
            />
          </g>
        </g>
      </g>
      <defs>
        <clipPath id="clip0_2708_1154">
          <rect
            width="22"
            height="22"
            fill="white"
            transform="matrix(1 0 0 -1 0 22)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
