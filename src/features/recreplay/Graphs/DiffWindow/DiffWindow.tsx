import { useContext } from "react";
import SnapshotContext, {
  defaultSnapshotContext,
} from "../contexts/SnapshotContext";
import DiffContext from "../contexts/DiffContext";
import { Tabs } from "@mantine/core";
import { SnapshotTopLevel } from "./SnapshotTopLevel";

export function DiffWindow() {
  const context = useContext(DiffContext);
  const { state1, state2 } = context || {};
  return (
    <Tabs radius="md" defaultValue="state1" w="0" style={{ flexGrow: 1 }}>
      {/* <DiffView /> */}
      <Tabs.List>
        <Tabs.Tab value="state1">State 1</Tabs.Tab>
        <Tabs.Tab value="state2">State 2</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="state1" pt="xs" w="100%">
        <SnapshotContext.Provider
          value={state1 ? state1 : defaultSnapshotContext}
        >
          <SnapshotTopLevel index={1} />
        </SnapshotContext.Provider>
      </Tabs.Panel>
      <Tabs.Panel value="state2" pt="xs" w="100%">
        <SnapshotContext.Provider
          value={state2 ? state2 : defaultSnapshotContext}
        >
          <SnapshotTopLevel index={2} />
        </SnapshotContext.Provider>
      </Tabs.Panel>
    </Tabs>
  );
}
