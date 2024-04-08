import { useContext, useEffect, useState } from "react";
import SnapshotContext from "../contexts/SnapshotContext";
import { Box, Button, Flex, TextInput } from "@mantine/core";

export function SelectPath() {
  const context = useContext(SnapshotContext);
  const { selectedPath, setSelectedPath, refMap } = context || {};
  console.log("got selected path ", selectedPath);
  const [text, setText] = useState<string>(selectedPath || "");

  useEffect(() => {
    setText(selectedPath || "");
  }, [selectedPath]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };
  return (
    <Flex gap="sm" style={{ border: 1 }}>
      <TextInput style={{ width: 400 }} value={text} onChange={handleChange} />
      <Button
        onClick={() => {
          if (setSelectedPath) {
            setSelectedPath(text);
          }
          // scrollToTreeItem(refMap, text);
        }}
      >
        Show Path
      </Button>
    </Flex>
  );
}
