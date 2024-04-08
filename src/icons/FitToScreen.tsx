import React, { ReactElement } from "react";
import { Icon } from "./Icon";

function FitToScreen(props: IconProps): ReactElement {
  return (
    <Icon {...props} viewBox="0 0 600 600">
      <path d="M450 300H500V100H300V150H450V300Z" fill="black" />
      <path d="M100 500H300V450H150V300H100V500Z" fill="black" />
      <path
        d="M550 600H50C36.7438 599.985 24.035 594.712 14.6615 585.339C5.28795 575.965 0.0152183 563.256 0 550V50C0.0152183 36.7438 5.28795 24.035 14.6615 14.6615C24.035 5.28795 36.7438 0.0152183 50 0H550C563.256 0.0152183 575.965 5.28795 585.339 14.6615C594.712 24.035 599.985 36.7438 600 50V550C599.985 563.256 594.712 575.965 585.339 585.339C575.965 594.712 563.256 599.985 550 600ZM50 50V550H550.03L550 50H50Z"
        fill="black"
      />
    </Icon>
  );
}
export default FitToScreen;
