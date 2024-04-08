import { useContext } from "react";
import GraphContext from "../contexts/GraphContext";
import DiffContext from "../contexts/DiffContext";
import { setStateToDiffContext } from "../Graph.utils";
import { Box, List, Text } from "@mantine/core";

export function CrawlDebugDataList() {
  const context = useContext(GraphContext);
  const diffContext = useContext(DiffContext);

  const { crawlDebugList } = context;
  if (crawlDebugList.length == 0) {
    return <Text>No Debug Data</Text>;
  }

  return (
    <Box style={{ maxHeight: 200, overflow: "scroll" }}>
      <Text>Debug Data</Text>
      <List>
        {(crawlDebugList || []).map((e: CrawlDebugData, index: number) => (
          <List.Item
            key={index}
            onClick={async () => {
              await setStateToDiffContext(diffContext, 1, e.stateId);
              if (e.exactStateId) {
                await setStateToDiffContext(diffContext, 2, e.exactStateId);
              }
            }}
          >
            <Text>{`Step: ${e.step} State: ${e.stateId}`}</Text>
            <Text>{e.exactStateId}</Text>
          </List.Item>
        ))}
      </List>
    </Box>
  );
}
