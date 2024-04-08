export const StructureIcon = ({
  className,
  fill = "#35ACEF",
  size,
}: CustomSVGIconProps & { size?: number; fill?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 96 96"
    fill="none"
    className={className}
    width={size}
    height={size}
  >
    <g clipPath="url(#clip0_2471_881)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M54 36H96V96H54V36ZM66 48V84H84V48H66ZM0 84H42V96H0V84ZM0 36H42V48H0V36ZM0 60H42V72H0V60ZM0 0H96V24H0V0Z"
        fill={fill}
      />
    </g>
    <defs>
      <clipPath id="clip0_2471_881">
        <rect width="96" height="96" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
