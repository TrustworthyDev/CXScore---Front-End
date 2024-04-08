import { useContext } from "react";
import SnapshotContext from "../contexts/SnapshotContext";
import { Button } from "@mantine/core";
import { openScreenshotFile } from "@/api";

export function LoadScreenshotButton() {
  const context = useContext(SnapshotContext);
  const { setScreenshot } = context || {};
  const loadState = async () => {
    const f = await openScreenshotFile();
    // console.log("open screenshot return ", f);
    if (f != null) {
      if (setScreenshot) {
        setScreenshot(f);
      }
    }
  };
  return <Button onClick={() => loadState()}>Load Screenshot</Button>;
}
