import { useContext, useState } from "react";
import SnapshotContext from "../contexts/SnapshotContext";
import { Box, Button, TextInput } from "@mantine/core";
import { getAllPaths } from "../Graph.utils";

export function SearchText() {
  const context = useContext(SnapshotContext);
  const { snapshot, selectedPath, setSelectedPath } = context;
  const [text, setText] = useState<string>("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };
  const doSearch = () => {
    if (snapshot) {
      const uiNodes = getAllPaths(snapshot);
      let selectedPathIndex = -1;
      if (selectedPath) {
        selectedPathIndex = uiNodes.findIndex((n) => n.path == selectedPath);
      }
      let found;
      const checkFn = (n: UiNode) =>
        n.label.toLowerCase().includes((text || "").toLowerCase());
      if (selectedPathIndex < 0) {
        found = uiNodes.find(checkFn);
      } else {
        console.log("search after ", selectedPathIndex);
        found = uiNodes.slice(selectedPathIndex + 1).find(checkFn);
        if (!found) {
          found = uiNodes.slice(0, selectedPathIndex + 1).find(checkFn);
        }
      }
      if (found) {
        // highlightTreeItem(context, found.path);
        setSelectedPath(found.path);
      }
    }
  };
  if (!context) {
    return null;
  }
  return (
    <Box style={{ mx: "auto", display: "inline-flex", border: 1 }}>
      <TextInput size="small" value={text} onChange={handleChange}></TextInput>
      <Button onClick={doSearch}>Search</Button>
    </Box>
  );
}
