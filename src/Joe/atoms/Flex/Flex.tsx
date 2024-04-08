import { forwardRef } from "react";
import { Box, BoxProps } from "../Box";

export type FlexProps = BoxProps;
export const Flex = forwardRef<HTMLDivElement, FlexProps>((props, ref) => {
  return <Box flex {...props} ref={ref} />;
});
