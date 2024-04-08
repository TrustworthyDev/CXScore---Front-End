import { useContext, useEffect, useRef, useState } from "react";
import SnapshotContext from "../contexts/SnapshotContext";
import { Box, Text } from "@mantine/core";
import { SearchText } from "./SearchText";
import { DataNodeKey } from "../Graph.utils";

export function SnapshotWindow() {
  const context = useContext(SnapshotContext);
  const { url } = context;
  const { snapshot, index } = context;
  const { selectedPath, setSelectedPath } = context;
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  // const [expanded, setExpanded] = React.useState<string[]>([]);
  // const [refMap, setRefMap]= React.useState({});

  const treeRef = useRef(null);

  useEffect(() => {
    if (selectedPath && treeRef.current) {
      (treeRef.current as any).scrollTo({
        key: DataNodeKey(index, selectedPath),
      });
      setSelectedKeys([DataNodeKey(index, selectedPath)]);
    }
  }, [treeRef, selectedPath]);
  if (!context) {
    return null;
  }

  if (!snapshot) {
    return (
      <Box m="xs">
        <Text>No snapshot loaded</Text>
      </Box>
    );
  }

  /*
  const handleExpandClick = () => {
    setExpanded((oldExpanded) =>
      oldExpanded.length === 0 ? getAllPaths(snapshot).map((n) => n.path) : []
    );
  };

  const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds);
  };
  

  const handleSelect = (event: React.SyntheticEvent, nodeId: string) => {
    if (nodeId) {
      if (setSelectedPath) {
        console.log('selected ', nodeId);
        setSelectedPath(nodeId);
      }
    }
  };
*/

  const handleAntTreeSelect = (selectedKeys: any) => {
    console.log("selectedKeys = ", selectedKeys);
    if (selectedKeys && selectedKeys.length > 0) {
      const s = selectedKeys[0];
      const i = s.indexOf("-");
      const path = s.substring(i + 1);
      if (setSelectedPath) {
        setSelectedPath(path);
      }
    }
  };

  // const treeData = [TNodeToDataNode(snapshot, index || 0)];
  return (
    <Box>
      <Box style={{ display: "flex", flexDirection: "row" }}>
        <Text style={{ p: 2 }}>URL</Text>
        <Text style={{ p: 2 }}>{url}</Text>
      </Box>
      <Box style={{ flexDirection: "row" }}>
        <SearchText />
      </Box>
      {/* TODO Tree module */}
      {/* <Tree
        ref={treeRef}
        height={200}
        treeData={treeData}
        onSelect={handleAntTreeSelect}
        defaultExpandAll={true}
        defaultExpandParent={true}
        selectedKeys={selectedKeys}
      /> */}
    </Box>
  );
}
