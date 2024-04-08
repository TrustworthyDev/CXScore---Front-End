import clsx from "clsx";
import React from "react";
import { Box } from "../Box";

export type ModalFooterProps = {
  children?: React.ReactNode;
  className?: string;
};

export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  className,
}) => {
  if (!children) {
    return null;
  }

  return (
    <Box
      flex
      className={clsx(
        "order-3 ml-2 flex-1 justify-end px-8 py-6 first:ml-0",
        className
      )}
    >
      {children}
    </Box>
  );
};

export default ModalFooter;
