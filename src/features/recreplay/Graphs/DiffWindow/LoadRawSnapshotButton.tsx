import { useContext } from "react";
import SnapshotContext from "../contexts/SnapshotContext";
import { Button } from "@mantine/core";
import { openRawSnapshotFile } from "@/api";

export function LoadRawSnapshotButton() {
  const context = useContext(SnapshotContext);
  const { setSnapshot, setScreenshot, setClickables, index } = context || {};
  const loadState = async () => {
    const f = await openRawSnapshotFile(index || 1);
    console.log("open snapshot return ", f);
    if (f != null) {
      const { snapshot, screenshot, clickables } = f;
      if (snapshot && setSnapshot) {
        setSnapshot(snapshot);
      }
      if (screenshot && setScreenshot) {
        setScreenshot(screenshot);
      }
      if (clickables && setClickables) {
        setClickables(clickables);
      }
    }
  };
  return <Button onClick={() => loadState()}>Load Raw Snapshot</Button>;
}
