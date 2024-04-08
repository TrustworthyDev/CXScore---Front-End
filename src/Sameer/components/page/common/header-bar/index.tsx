import { Group } from "@mantine/core";

import { Header } from "~/features/shared/Header/Header";

import { AppSelectionMenu } from "./app-selection-menu";
import { ScanSelectionMenu } from "./scan-selection-menu";
import ViewReport from "./ViewReport";

export const HeaderBar = ({
  rightComponent,
}: {
  rightComponent?: React.ReactNode;
}) => {
  return (
    <Header
      leftElement={
        <Group wrap="wrap">
          <AppSelectionMenu />
          <ScanSelectionMenu />
        </Group>
      }
      rightElement={
        <Group>
          <ViewReport />
          {rightComponent}
        </Group>
      }
    />
  );
};

