import { Group, Paper } from "@mantine/core";
import React from "react";

type HeaderProps = {
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
};

export const Header: React.FC<HeaderProps> = ({
  leftElement,
  rightElement,
}) => {
  return (
    <Paper radius="md" bg="var(--mantine-color-blue-light)" withBorder my="md">
      <Group px="lg" py="md" justify="space-between">
        {leftElement}
        {rightElement}
      </Group>
    </Paper>
  );
};
