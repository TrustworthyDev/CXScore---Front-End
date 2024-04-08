import { useContext } from "react";
import SnapshotContext from "../contexts/SnapshotContext";
import { Button } from "@mantine/core";
import { openSnapshotFile } from "@/api";

export function LoadSnapshotButton() {
  const context = useContext(SnapshotContext);
  const { setSnapshot, setScreenshot, index } = context || {};
  const loadState = async () => {
    const f = await openSnapshotFile(index || 1);
    console.log("open snapshot return ", f);
    if (f != null) {
      const { snapshot, screenshot } = f;
      if (snapshot && setSnapshot) {
        setSnapshot(snapshot);
      }
      if (screenshot && setScreenshot) {
        setScreenshot(screenshot);
      }
    }
  };
  return <Button onClick={() => loadState()}>Load States</Button>;
}
