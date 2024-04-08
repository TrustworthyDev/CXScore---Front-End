import { Title, TitleOrder } from "@mantine/core";
import React from "react";

import { Header } from "./Header";

type TextHeaderProps = {
  title: string;
  order?: TitleOrder;
  rightElement?: React.ReactNode;
};

export const TextHeader: React.FC<TextHeaderProps> = ({
  title,
  order = 3,
  rightElement,
}) => {
  return (
    <Header
      leftElement={<Title order={order}>{title}</Title>}
      rightElement={rightElement}
    />
  );
};
