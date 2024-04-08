export const UserSettingsIcon = ({
  className,
  fill = "#35ACEF",
  size,
}: CustomSVGIconProps & { size?: number; fill?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 151 151"
    fill="none"
    className={className}
    width={size}
    height={size}
  >
    <path
      d="M134.262 99.2238C134.787 96.3721 134.787 93.4596 134.262 90.6079L139.48 87.5942C140.086 87.2502 140.349 86.5426 140.147 85.8751C138.792 81.5065 136.466 77.5423 133.432 74.2658C132.967 73.76 132.219 73.6391 131.612 73.9821L126.394 76.9958C124.189 75.1149 121.661 73.6586 118.931 72.6877V66.6606C118.931 65.9735 118.445 65.3662 117.778 65.2246C113.268 64.2129 108.676 64.2539 104.389 65.2246C103.721 65.3659 103.236 65.9731 103.236 66.6606V72.6877C100.505 73.6585 97.9772 75.1149 95.7727 76.9958L90.5545 73.9821C89.968 73.6381 89.1994 73.76 88.7342 74.2658C85.7004 77.5423 83.3745 81.5065 82.0194 85.8751C81.8172 86.5427 82.1003 87.2504 82.6869 87.5942L87.905 90.6079C87.3792 93.4596 87.3792 96.3721 87.905 99.2238L82.6869 102.237C82.0801 102.582 81.8172 103.289 82.0194 103.957C83.3745 108.325 85.7004 112.269 88.7342 115.566C89.1994 116.072 89.9478 116.193 90.5545 115.85L95.7727 112.836C97.9772 114.717 100.505 116.173 103.236 117.144V123.171C103.236 123.859 103.721 124.466 104.389 124.607C108.899 125.619 113.49 125.578 117.778 124.607C118.445 124.466 118.931 123.859 118.931 123.171V117.144C121.661 116.173 124.189 114.717 126.394 112.836L131.612 115.85C132.199 116.194 132.967 116.072 133.432 115.566C136.466 112.289 138.792 108.325 140.147 103.957C140.349 103.289 140.066 102.581 139.48 102.237L134.262 99.2238ZM111.103 104.725C105.683 104.725 101.294 100.316 101.294 94.9158C101.294 89.5157 105.703 85.1065 111.103 85.1065C116.504 85.1065 120.913 89.5157 120.913 94.9158C120.913 100.316 116.524 104.725 111.103 104.725ZM56.0905 75.4995C70.3899 75.4995 81.979 63.9104 81.979 49.6111C81.979 35.3118 70.3899 23.7227 56.0905 23.7227C41.7912 23.7227 30.2021 35.3118 30.2021 49.6111C30.2021 63.9104 41.7912 75.4995 56.0905 75.4995ZM96.7839 121.31C96.3188 121.067 95.8536 120.784 95.4086 120.522L93.8108 121.452C92.5973 122.14 91.222 122.524 89.8466 122.524C87.6421 122.524 85.5184 121.594 84.0015 119.976C80.3003 115.971 77.4687 111.097 75.8709 105.899C74.7585 102.319 76.2552 98.5371 79.4913 96.6562L81.0891 95.7254C81.0688 95.2001 81.0688 94.6738 81.0891 94.1479L79.4913 93.217C76.2552 91.3563 74.7585 87.5539 75.8709 83.974C76.053 83.3873 76.3159 82.801 76.5181 82.2144C75.7496 82.1497 75.0012 81.9718 74.2125 81.9718H70.8348C66.3448 84.0347 61.3491 85.2078 56.0905 85.2078C50.832 85.2078 45.8565 84.0347 41.3463 81.9718H37.9686C22.9614 81.9716 10.7858 94.1473 10.7858 109.154V117.568C10.7858 122.928 15.1342 127.276 20.4939 127.276H91.6872C93.7299 127.276 95.6311 126.629 97.1885 125.557C96.9457 124.788 96.7839 124 96.7839 123.171V121.31Z"
      fill={fill}
    />
  </svg>
);
