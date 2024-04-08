import React, { ReactElement } from "react";
import { Icon } from "./Icon";

function Record(props: IconProps): ReactElement {
  return (
    <Icon {...props} viewBox="0 0 95 95">
      <g clipPath="url(#a)">
        <path
          fillRule="evenodd"
          d="M47.5 0C73.692 0 95 21.308 95 47.5S73.692 95 47.5 95 0 73.692 0 47.5 21.308 0 47.5 0Zm0 5.588C24.387 5.588 5.588 24.387 5.588 47.5S24.387 89.412 47.5 89.412s41.912-18.8 41.912-41.912c0-23.113-18.8-41.912-41.912-41.912Zm0 15.523c14.574 0 26.389 11.815 26.389 26.389S62.074 73.889 47.5 73.889 21.111 62.074 21.111 47.5 32.926 21.111 47.5 21.111Z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path d="M0 0h95v95H0z" />
        </clipPath>
      </defs>
    </Icon>
  );
}
export default Record;
