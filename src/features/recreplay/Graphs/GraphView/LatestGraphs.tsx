import { useContext, useEffect, useState } from "react";
import GraphContext from "../contexts/GraphContext";
import { Box, Button, Center, Flex, List, Loader, Text } from "@mantine/core";
import { getLatestGraphs } from "@/api";

export function LatestGraphs() {
  const [latestGraphs, setLatestGraphs] = useState<any[]>([]);
  const { setGraphId } = useContext(GraphContext);
  const [isLoading, setIsloading] = useState(false);

  const loadGraphs = async () => {
    setIsloading(true);
    try {
      const gs = await getLatestGraphs();
      console.log("got latest graphs ", gs);
      setLatestGraphs(gs);
    } finally {
      setIsloading(false);
    }
  };
  useEffect(() => {
    loadGraphs();
  }, []);

  const summaryString = (e: any) =>
    `${e.config?.appId?.name} vertices: ${e.nVertices} edges: ${e.nEdges}`;
  return (
    <Box>
      <Flex p="sm" align="baseline">
        <Text>Latest Graphs</Text>
        <Button p="sm" onClick={loadGraphs}>
          Refresh
        </Button>
      </Flex>
      {isLoading ? (
        <Center>
          <Loader />
        </Center>
      ) : (
        <List
          styles={{
            item: {
              // ":hover": {
              //   cursor: "pointer",
              // },
            },
          }}
          style={{
            overflow: "scroll",
            maxHeight: "300px",
          }}
        >
          {latestGraphs.map((e: any, index: number) => (
            <List.Item
              key={index}
              onClick={() => {
                setGraphId(e.id);
              }}
            >
              <Text>{e.id}</Text>
              <Text size="sm">{summaryString(e)}</Text>
            </List.Item>
          ))}
        </List>
      )}
    </Box>
  );
}
