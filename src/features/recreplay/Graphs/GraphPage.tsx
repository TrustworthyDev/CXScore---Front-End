import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { loadGraph } from "./Graph.utils";
import { useSnapshotContext } from "./useSnapshotContext";
import DiffContext from "./contexts/DiffContext";
import GraphContext from "./contexts/GraphContext";
import { GraphView } from "./GraphView/GraphView";
import { DiffWindow } from "./DiffWindow/DiffWindow";
import { Divider, Flex } from "@mantine/core";

export function GraphPage() {
  const [graph, setGraph] = useState<any>(null);
  const [crawlDebugList, setCrawlDebugList] = useState<CrawlDebugData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string>("");
  const [graphId, setGraphId] = useState<string>("");
  const state1 = useSnapshotContext(1);
  const state2 = useSnapshotContext(2);
  const [diff, setDiff] = useState<Diff[]>([]);

  const [searchParams] = useSearchParams();

  const graphContext: GraphContextInterface = {
    graph,
    setGraph,
    graphId,
    setGraphId,
    crawlDebugList,
    setCrawlDebugList,
    loading,
    setLoading,
    loadError,
    setLoadError,
  };
  useEffect(() => {
    const routeGid = searchParams.get("gid");
    if (routeGid && routeGid != graphId) {
      loadGraph(routeGid, graphContext);
    }
  }, []);

  return (
    <Flex p="lg" gap="xl" maw="100vw">
      <DiffContext.Provider
        value={{
          state1,
          state2,
          diff,
          setDiff,
        }}
      >
        <GraphContext.Provider value={graphContext}>
          <GraphView />
        </GraphContext.Provider>
        <Divider orientation="vertical" />
        <DiffWindow />
      </DiffContext.Provider>
    </Flex>
  );
}
