import { ReactElement } from "react";
export const RightDirectionBulletIcon = ({
  fill,
  size,
  ...props
}: CustomSVGIconProps & { size: number }): ReactElement => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.03749 3.82083L3.20832 1.27917C2.06249 0.674999 0.816656 1.89583 1.39582 3.05417L2.07082 4.40417C2.25832 4.77917 2.25832 5.22083 2.07082 5.59583L1.39582 6.94583C0.816656 8.10417 2.06249 9.32083 3.20832 8.72083L8.03749 6.17917C8.98749 5.67917 8.98749 4.32083 8.03749 3.82083Z"
        fill="#1446FF"
      />
    </svg>
  );
};
