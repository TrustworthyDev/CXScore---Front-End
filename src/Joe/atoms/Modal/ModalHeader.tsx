import React from "react";
import { Text } from "../Text";

export type ModalHeaderProps = {
  title: string;
};

export const ModalHeader: React.FC<ModalHeaderProps> = ({ title }) => {
  return (
    <Text variant="h2" className="text-black">
      {title}
    </Text>
  );
};

export default ModalHeader;
