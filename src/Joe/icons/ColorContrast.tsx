import { ReactElement } from "react";
export const ColorContrastIcon = ({
  fill,
  size = 18,
  ...props
}: CustomSVGIconProps & { size: number }): ReactElement => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_22_417)">
      <path
        d="M17.9857 8.49578C17.9836 8.46433 17.9804 8.4334 17.9786 8.40194C17.9786 8.4001 17.9783 8.39853 17.9783 8.39696C17.9783 8.39512 17.9781 8.39355 17.9778 8.39172C17.9686 8.25462 17.9568 8.11805 17.9416 7.98252C17.939 7.95841 17.9353 7.93429 17.9324 7.91044C17.9144 7.7605 17.8926 7.61187 17.8669 7.46455C17.8648 7.45406 17.8632 7.44358 17.8614 7.43335C17.8334 7.27214 17.8006 7.11224 17.7636 6.95417C17.7636 6.95338 17.7631 6.9526 17.7631 6.95207C17.7631 6.95155 17.7628 6.95102 17.7628 6.95076C17.6263 6.36646 17.4331 5.80445 17.1888 5.27022C17.1882 5.26969 17.1882 5.26917 17.1882 5.26864C16.9445 4.73599 16.6501 4.23112 16.3117 3.76006C16.3093 3.75691 16.3069 3.75377 16.3051 3.75062C16.0792 3.43685 15.8335 3.13828 15.5698 2.85648V2.85622C15.5693 2.85596 15.5693 2.85596 15.5693 2.85569C14.8681 2.10704 14.0411 1.47844 13.1225 1.00293C13.1225 1.00293 13.122 1.00293 13.122 1.00267C13.121 1.0024 13.1202 1.00188 13.1194 1.00162C12.9668 0.922452 12.8116 0.848006 12.6546 0.777753C12.6541 0.777753 12.6541 0.777753 12.6536 0.777491C12.6525 0.776967 12.651 0.776181 12.6496 0.775656C12.6489 0.775394 12.6481 0.775132 12.6475 0.774608C12.5351 0.725064 12.4221 0.677356 12.3076 0.632007C12.2965 0.627288 12.2853 0.623094 12.274 0.618638C12.165 0.57591 12.0549 0.535279 11.9437 0.496483C11.9262 0.490454 11.9081 0.484425 11.8905 0.478658C11.7825 0.441697 11.6742 0.406833 11.5644 0.374328C11.5455 0.368823 11.5261 0.363319 11.507 0.358076C11.3951 0.325833 11.2831 0.294639 11.1702 0.266329C11.1696 0.266329 11.1696 0.266067 11.1691 0.266067C11.1505 0.261348 11.1314 0.257678 11.1127 0.25296C11.1109 0.252436 11.1088 0.252174 11.1072 0.251649C10.6414 0.139456 10.1622 0.064223 9.67101 0.0277863C9.66996 0.0277863 9.66839 0.0275241 9.66681 0.0275241C9.61675 0.0238543 9.56668 0.0191358 9.51609 0.0159902C9.51556 0.0159902 9.51478 0.0159902 9.51425 0.0159902C9.34491 0.0060291 9.174 0 9.00152 0C4.03905 0 0.00164795 4.03714 0.00164795 8.99987C0.00164795 13.9629 4.038 18 9.00047 18C9.16116 18 9.32132 17.995 9.47965 17.9869C9.48017 17.9869 9.4807 17.9869 9.48148 17.9869C9.5229 17.9843 9.56327 17.9803 9.60495 17.9775C9.60705 17.9772 9.60914 17.9772 9.61072 17.9769C9.72763 17.9691 9.84454 17.9604 9.95988 17.9484C9.96145 17.9481 9.96329 17.9478 9.96486 17.9476C10.1227 17.9313 10.2789 17.9093 10.4343 17.8847C10.4349 17.8847 10.4354 17.8847 10.4359 17.8847C10.4708 17.8792 10.5054 17.8718 10.54 17.8658C10.5405 17.8658 10.541 17.8658 10.5416 17.8658C10.6836 17.8411 10.8247 17.8134 10.9644 17.7822C10.9722 17.7803 10.9798 17.7782 10.9874 17.7767C11.1164 17.7473 11.2446 17.7158 11.3717 17.6812C11.3725 17.6807 11.3733 17.6807 11.3744 17.6805C11.3922 17.675 11.4103 17.6702 11.4281 17.665C11.4286 17.6645 11.4291 17.6645 11.4297 17.6642C12.4323 17.3829 13.3645 16.9318 14.1934 16.3436C14.1939 16.3436 14.1944 16.343 14.1949 16.3428C14.1949 16.3425 14.1949 16.3425 14.1955 16.3423C14.1955 16.342 14.196 16.3417 14.1965 16.3415C14.4442 16.1656 14.6825 15.9779 14.9108 15.7789C14.9119 15.7779 14.9134 15.7768 14.9145 15.7758C15.0272 15.677 15.1373 15.576 15.2448 15.4722C15.2469 15.4701 15.249 15.4683 15.2505 15.4667C15.3588 15.3621 15.4644 15.2544 15.5672 15.1448C15.5675 15.1443 15.5677 15.1443 15.5683 15.1438C15.5683 15.1433 15.5688 15.1433 15.5688 15.1433C15.8535 14.8392 16.1166 14.5152 16.3573 14.1736C16.3578 14.1731 16.3583 14.172 16.3588 14.1715C16.7754 13.5807 17.1222 12.9387 17.388 12.2553C17.388 12.2548 17.3883 12.2543 17.3885 12.2537C17.3888 12.253 17.389 12.2524 17.3893 12.2519C17.3906 12.2482 17.3917 12.2454 17.3932 12.2422C17.4415 12.1177 17.4863 11.9924 17.5295 11.8653C17.5301 11.8637 17.5306 11.8624 17.5311 11.8608C17.5314 11.8592 17.5319 11.8579 17.5324 11.8563C17.533 11.8548 17.5332 11.8537 17.5337 11.8519C17.534 11.8511 17.5343 11.8501 17.5348 11.8493C17.5348 11.8485 17.5353 11.8474 17.5353 11.8464C17.5783 11.7182 17.6184 11.5884 17.6556 11.4574C17.6562 11.4553 17.6567 11.4532 17.6572 11.4519V11.4514V11.4508C17.6952 11.3182 17.7293 11.1842 17.761 11.0498C17.761 11.0495 17.761 11.0495 17.761 11.049C17.761 11.0485 17.7613 11.0474 17.7615 11.0469C17.7618 11.0464 17.7618 11.0458 17.7618 11.0448C17.799 10.8865 17.8318 10.7268 17.8598 10.5656C17.8617 10.5554 17.864 10.5452 17.8653 10.5344C17.8908 10.3871 17.9125 10.2385 17.9309 10.0888C17.9338 10.0644 17.9372 10.0403 17.94 10.0167C17.9555 9.87986 17.9673 9.74119 17.9767 9.60252C17.9788 9.56949 17.9823 9.53672 17.9841 9.50369C17.9933 9.33671 17.999 9.16868 17.999 8.99934C17.9985 8.83053 17.9948 8.66276 17.9857 8.49578ZM16.9361 9.4822C16.934 9.51156 16.9314 9.54144 16.9295 9.57054C16.9285 9.5839 16.9274 9.59727 16.9264 9.61012C16.9248 9.63188 16.9214 9.65337 16.9198 9.67513C16.9112 9.7771 16.902 9.87854 16.8897 9.97947C16.8847 10.017 16.8805 10.0542 16.8753 10.0914C16.8302 10.4162 16.7665 10.7355 16.6839 11.0471C16.6839 11.0471 16.6839 11.0471 16.6839 11.0477V11.0482H15.1855V13.0962H15.8133C15.7365 13.2239 15.6537 13.3476 15.5696 13.4701C15.5551 13.491 15.5423 13.5128 15.5281 13.5335C15.5203 13.5448 15.5119 13.556 15.504 13.5673C15.5001 13.5728 15.4964 13.5778 15.4928 13.583C15.3945 13.7217 15.2922 13.8583 15.1855 13.9904V13.0968H13.1377V15.1446H14.0424C13.9071 15.256 13.7674 15.3611 13.625 15.4633C13.5978 15.4825 13.5713 15.5016 13.544 15.5207C13.4513 15.5857 13.3545 15.646 13.2591 15.7071C13.2046 15.742 13.1522 15.78 13.0966 15.8135V15.1446H11.0488V16.6836C10.7374 16.7664 10.4181 16.8304 10.093 16.8752C10.082 16.8765 10.0713 16.8778 10.0603 16.8796C10.033 16.8828 10.0063 16.8862 9.97928 16.8899C9.85686 16.9051 9.73392 16.9171 9.61045 16.9263C9.56799 16.93 9.52552 16.9334 9.48253 16.936C9.32316 16.9457 9.68307 16.9606 9.00047 16.9522C8.31787 16.9441 7.08348 16.7169 7.08348 16.7169L6.95241 16.6836C6.22368 16.4896 5.53557 16.1947 4.90435 15.8138V15.8083C2.56506 14.4195 0.993041 11.8692 0.993041 8.95688C0.993041 4.56638 4.56489 0.994539 8.95538 0.994539V1.05116C8.97058 1.0509 8.98526 1.04959 9.00047 1.04959V2.85727H11.0483V1.31854C11.2213 1.36467 11.3914 1.41762 11.5597 1.47477C11.5791 1.48132 11.599 1.48788 11.6187 1.49495C11.7891 1.55446 11.9571 1.61842 12.122 1.68893C12.1228 1.6892 12.1238 1.68972 12.1249 1.69024C12.2787 1.75604 12.4292 1.82813 12.5778 1.9031C12.5886 1.9086 12.5983 1.91358 12.609 1.91909C12.6331 1.93141 12.6572 1.94347 12.6808 1.95605C12.83 2.03443 12.9776 2.11543 13.1215 2.20298V2.85727H14.0426C14.462 3.20171 14.8445 3.58941 15.1858 4.01145V4.90506H15.8136C15.8136 4.90533 15.8139 4.90559 15.8139 4.90559C15.8521 4.96902 15.8857 5.03561 15.9221 5.10009C15.9683 5.1824 16.0162 5.26393 16.0598 5.34781C16.0742 5.37455 16.0875 5.40155 16.1014 5.42881C16.2519 5.72686 16.3832 6.03565 16.4959 6.35362C16.5001 6.36568 16.5056 6.37747 16.5098 6.38953C16.5138 6.40054 16.5172 6.41129 16.5211 6.4223C16.524 6.43069 16.5266 6.43908 16.5298 6.44773C16.5607 6.54 16.5866 6.6341 16.615 6.72716C16.6372 6.80161 16.6629 6.87474 16.6834 6.94998C16.6834 6.95102 16.6839 6.95207 16.6839 6.95312H15.1863V8.99987H16.9526C16.9518 9.16213 16.9458 9.32256 16.9361 9.4822Z"
        fill="#545454"
      />
      <path
        d="M13.0965 2.85648H11.0487V4.90454H13.0965V2.85648Z"
        fill="#545454"
      />
      <path
        d="M11.0484 4.90428H9.00037V6.95234H11.0484V4.90428Z"
        fill="#545454"
      />
      <path
        d="M15.1854 4.90428H13.1371V6.95234H15.1854V4.90428Z"
        fill="#545454"
      />
      <path
        d="M13.0965 6.95234H11.0487V9.00039H13.0965V6.95234Z"
        fill="#545454"
      />
      <path
        d="M15.1443 9.00013H13.0962V11.0479H15.1443V9.00013Z"
        fill="#545454"
      />
      <path
        d="M13.0965 11.0479H11.0487V13.096H13.0965V11.0479Z"
        fill="#545454"
      />
      <path
        d="M11.0484 9.00013H9.00037V11.0479H11.0484V9.00013Z"
        fill="#545454"
      />
      <path
        d="M11.0484 13.096H9.00037V15.1438H11.0484V13.096Z"
        fill="#545454"
      />
    </g>
    <defs>
      <clipPath id="clip0_22_417">
        <rect width="18" height="18" fill="white" />
      </clipPath>
    </defs>
  </svg>
);