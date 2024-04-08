import clsx from "clsx";

export const CXScoreLogo = (props: CustomSVGIconProps) => {
  return (
    <svg
      viewBox="0 0 103 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="CXScore Logo"
      {...props}
      className={clsx("w-32 object-contain md:w-48", props.className)}
    >
      <path
        d="M45.7314 21.7993H36.9058L32.894 17.0092L37.3068 11.7402L45.7311 21.7987L45.7314 21.7993ZM28.4811 11.74L27.8125 10.9418L29.1495 10.9414L28.4812 11.7398L28.4811 11.74Z"
        fill="#1446FF"
      />
      <path
        d="M29.2109 11.0459H27.8867L28.5488 10.234L29.2105 11.0455L29.2109 11.0459ZM37.2899 10.234H37.2894V10.2335L32.9198 4.87329L36.8933 0H45.6345L37.2899 10.234Z"
        fill="#1446FF"
      />
      <path
        d="M10.9613 21.7996C8.43162 21.798 5.98021 20.9306 4.02238 19.3444C2.06455 17.7582 0.720673 15.5506 0.218391 13.0956C-0.283892 10.6407 0.0863045 8.08928 1.26627 5.87363C2.44623 3.65798 4.36342 1.9143 6.69307 0.937968C8.04336 0.37212 9.4951 0.0819163 10.9613 0.0847372L18.7178 0.0886148V7.30201H11.2937C10.1842 7.30201 9.14109 7.68759 8.35646 8.38774C7.57184 9.08788 7.13988 10.0185 7.13988 11.0084C7.13988 11.9983 7.57194 12.9279 8.35646 13.6278C9.14098 14.3276 10.1843 14.7134 11.2937 14.7134H18.7177V21.7934L10.9613 21.7996ZM18.8145 21.7933H18.8139L18.8143 21.7929L27.8107 10.9423L18.7211 0.0886679L27.5369 0.0930767L36.6054 10.9423L27.5295 21.7863L18.8145 21.7933Z"
        fill="#0B1D36"
      />
      <path
        d="M58.1178 7.08513L57.2331 8.59808C56.3708 8.07165 55.4839 7.80843 54.5723 7.80843C54.0362 7.80843 53.6028 7.90798 53.2721 8.10706C52.9415 8.30615 52.7762 8.5782 52.7762 8.92322C52.7726 9.07561 52.8197 9.22495 52.9104 9.34816C53.0218 9.48383 53.1674 9.58797 53.3326 9.65008C53.5243 9.7318 53.7227 9.79728 53.9257 9.84582C54.1289 9.89447 54.3914 9.94534 54.7131 9.99843L55.2426 10.0847C57.2352 10.4076 58.2315 11.2747 58.2315 12.6859C58.2392 13.1494 58.131 13.6076 57.9165 14.0197C57.7168 14.402 57.4243 14.7292 57.0654 14.9719C56.692 15.2202 56.28 15.4062 55.8459 15.5225C55.3721 15.651 54.8828 15.7146 54.3916 15.7116C53.6594 15.7117 52.9313 15.6055 52.2302 15.3964C51.5221 15.1863 50.9245 14.8866 50.4375 14.4973L51.4092 13.0043C51.8143 13.3127 52.2668 13.5547 52.7494 13.7209C53.2777 13.9113 53.8358 14.0079 54.3981 14.0063C54.9342 14.0063 55.3754 13.9067 55.7217 13.7076C56.0679 13.5086 56.2411 13.2343 56.2411 12.8848C56.2411 12.5795 56.0847 12.3495 55.7719 12.1947C55.4592 12.0399 54.9521 11.9071 54.2506 11.7963L53.6544 11.7036C51.7466 11.4074 50.7927 10.5204 50.7927 9.04268C50.7865 8.59995 50.89 8.16246 51.0943 7.76859C51.2873 7.39726 51.5692 7.07832 51.9153 6.83962C52.2787 6.59275 52.6806 6.40668 53.1049 6.28884C53.5691 6.15811 54.0497 6.09326 54.5323 6.09623C55.1568 6.09149 55.7791 6.17074 56.382 6.33181C56.9919 6.50528 57.5756 6.75863 58.1178 7.08513ZM65.7041 6.08311C66.5298 6.07346 67.3454 6.26366 68.08 6.63719C68.7971 7.00657 69.3455 7.5165 69.7252 8.16698L68.1168 9.14222C67.8609 8.74653 67.5082 8.42129 67.0914 8.19672C66.6606 7.96958 66.1787 7.85429 65.6907 7.8616C64.8329 7.8616 64.1248 8.14474 63.5664 8.71101C63.0079 9.27728 62.7287 10.0072 62.7286 10.9007C62.733 11.8164 63.0168 12.5519 63.5797 13.1071C64.1427 13.6623 64.8464 13.9399 65.6908 13.9399C66.1758 13.9467 66.6549 13.8338 67.0848 13.6114C67.5079 13.3856 67.8691 13.0611 68.1369 12.6659L69.6649 13.7542C69.2425 14.3674 68.6693 14.864 67.9995 15.1974C67.3137 15.5447 66.5486 15.7184 65.7042 15.7184C65.0257 15.7242 64.3524 15.6015 63.7205 15.3567C63.1361 15.1334 62.6037 14.7947 62.1556 14.3614C61.7157 13.9257 61.3712 13.4049 61.1437 12.8316C60.8969 12.2174 60.7729 11.5616 60.7784 10.9006C60.7729 10.2397 60.8969 9.58402 61.1436 8.96991C61.3712 8.39654 61.7157 7.87578 62.1556 7.44011C62.6037 7.00677 63.1361 6.66812 63.7204 6.44474C64.3523 6.19999 65.0257 6.07724 65.7041 6.08311ZM76.9698 6.08311C77.9169 6.08311 78.7669 6.29103 79.5198 6.70688C80.2563 7.10676 80.8647 7.70339 81.2756 8.42885C81.6934 9.16099 81.9023 9.98493 81.9023 10.9007C81.9023 11.8164 81.6934 12.6404 81.2756 13.3725C80.8647 14.0979 80.2564 14.6945 79.5198 15.0944C78.767 15.5102 77.917 15.7181 76.9698 15.7181C76.291 15.724 75.6175 15.6001 74.9861 15.3532C74.4014 15.1275 73.869 14.7866 73.4213 14.3512C72.9823 13.9147 72.638 13.3942 72.4093 12.8214C72.1628 12.2106 72.0387 11.5581 72.0441 10.9003C72.0387 10.2426 72.1628 9.59006 72.4093 8.97925C72.638 8.40645 72.9823 7.88589 73.4213 7.44946C73.869 7.01406 74.4014 6.67317 74.9861 6.44745C75.6175 6.20076 76.2911 6.07705 76.9698 6.08311H76.9698ZM76.9698 7.8615C76.103 7.8615 75.3904 8.14352 74.8319 8.70756C74.2735 9.2716 73.9942 10.0026 73.9942 10.9007C73.9942 11.7987 74.2735 12.5298 74.832 13.0938C75.3905 13.6579 76.1031 13.9399 76.9698 13.9399C77.8411 13.9399 78.5548 13.6579 79.111 13.0938C79.6673 12.5298 79.9454 11.7987 79.9454 10.9007C79.9454 10.0026 79.6673 9.2716 79.111 8.70756C78.5548 8.14352 77.8411 7.8615 76.9698 7.8615H76.9698ZM84.9248 6.25559H88.8922C90.0003 6.25559 90.8503 6.50221 91.4422 6.99546C92.0342 7.48872 92.3302 8.1844 92.3302 9.08252C92.3302 9.84784 92.0756 10.4749 91.5662 10.9638C91.0569 11.4526 90.3532 11.7391 89.4552 11.8231L92.3436 15.5459H90.0784L87.3441 11.8497H86.7946V15.5459H84.9248V6.25559ZM88.8588 7.96099H86.7946V10.2371H88.8588C89.8908 10.2371 90.4069 9.85221 90.4069 9.08246C90.4069 8.33485 89.8908 7.96099 88.8588 7.96099Z"
        fill="#1446FF"
      />
      <path
        d="M102.387 7.94749H95.3867V6.23328H102.388V7.94749H102.387Z"
        fill="#1446FF"
      />
      <path
        d="M102.387 11.7155H95.3867V10.0859H102.387V11.7155Z"
        fill="#1446FF"
      />
      <path
        d="M102.388 15.5683H95.3867V13.8367H102.388V15.5683Z"
        fill="#1446FF"
      />
    </svg>
  );
};
