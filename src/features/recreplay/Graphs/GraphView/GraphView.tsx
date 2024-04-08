import { useContext, useEffect, useState } from "react";
import DiffContext from "../contexts/DiffContext";
import GraphContext from "../contexts/GraphContext";
import { loadGraph, setStateToDiffContext } from "../Graph.utils";
import Graph from "react-vis-network-graph";
import { LatestGraphs } from "./LatestGraphs";
import { SearchVertice } from "./SearchVertice";
import { GraphInfo } from "./GraphInfo";
import { EdgeInfo } from "./EdgeInfo";
import { CrawlDebugDataList } from "./CrawlDebugDataList";
import {
  Button,
  Flex,
  Loader,
  Stack,
  Text,
  TextInput,
  rem,
} from "@mantine/core";

export function GraphView() {
  const diffContext = useContext(DiffContext);
  const context = useContext(GraphContext);
  const { graph, graphId } = context;
  const [value, setValue] = useState(0);
  const [myGraphId, setMyGraphId] = useState<string>("");
  const [crawlInfo, setCrawlInfo] = useState<CrawlInfo>({
    status: "unknown",
    step: 0,
  });
  const [edgeEvents, setEdgeEvents] = useState([]);
  const [network, setNetwork] = useState<any>(null);

  const { loading, loadError } = context || {};

  useEffect(() => {
    if (graphId) {
      setMyGraphId(graphId);
    }
  }, [graphId]);
  const options = {
    layout: {
      //   hierarchical: true,
      improvedLayout: false,
    },
    interaction: {
      selectConnectedEdges: false,
    },
    nodes: {
      color: {
        highlight: "#FF0000",
      },
    },
    edges: {
      color: {
        highlight: "#FF0000",
      },
      smooth: {
        enabled: true,
        roundness: 0.2,
        type: "dynamic",
      },
      // physics: false,
    },
    physics: {
      stabilization: {
        enabled: true,
        iterations: 1000,
        updateInterval: 25,
      },
    },
    /*
    physics: {
      enabled: false,
    },*/
    width: "100%",
    height: "500px",
    autoResize: true,
  };

  const events = {
    select: async (event: any) => {
      // console.log('got select event ', event);
      const { nodes, edges } = event;
      let n, e;
      let stateId;
      if (nodes && nodes.length > 0) {
        n = nodes[0];
        // console.log('selected node ', n);
        // seems what we are getting is the id, which by our convention starts with 1
        stateId = graph.nodes[n - 1].stateId;
        const vertexId = graph.nodes[n - 1].vertexId;
        const stateIndex = event.event.srcEvent?.ctrlKey ? 2 : 1;

        setStateToDiffContext(diffContext, stateIndex, stateId, vertexId, true);
      }
      if (edges && edges.length > 0) {
        e = edges[0];

        const edge = graph.edges[e - 1];
        console.log("selected edge ", edge);
        const es = edge.eventSequence;
        if (es) {
          setEdgeEvents(es);
        }
        // if we select an edge, we put the source state to state 1
        // and target state to state 2

        const stateId1 = graph.nodes[edge.from - 1].stateId;
        const vertexId1 = graph.nodes[edge.from - 1].vertexId;
        setStateToDiffContext(diffContext, 1, stateId1, vertexId1, true);
        const stateId2 = graph.nodes[edge.to - 1].stateId;
        const vertexId2 = graph.nodes[edge.to - 1].vertexId;
        setStateToDiffContext(diffContext, 2, stateId2, vertexId2, true);
        if (es && es.length > 0) {
          setTimeout(
            () => diffContext?.state1.setSelectedPath(es[0].path),
            1000
          );
        }
      }
    },

    stabilizationIterationsDone: () => {
      console.log("in stablization handler");
      if (network) {
        console.log("disable physics");
        network.setOptions({ physics: false });
      }
    },
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  if (!context) {
    return null;
  }
  return (
    <Stack gap="md" w={rem(400)}>
      {/* {getElectronApi().inElectron() ? (
          <CrawlContext.Provider value={{ crawlInfo, setCrawlInfo }}>
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab
                    style={{ textTransform: "none" }}
                    label="Live"
                    {...a11yProps(0)}
                  />
                  <Tab
                    style={{ textTransform: "none" }}
                    label="Db"
                    {...a11yProps(1)}
                  />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                <StartCrawl />
                <CrawlUi />
              </TabPanel>

              <TabPanel value={value} index={1}>
                <LatestGraphs />
              </TabPanel>
            </Box>
          </CrawlContext.Provider>
        ) : (
          <LatestGraphs />
        )} */}
      <LatestGraphs />
      <Flex
        p="sm"
        w="80%"
        align="end"
        style={{
          border: "1px solid grey",
        }}
        gap="md"
      >
        <TextInput
          style={{ width: 400 }}
          label="Graph Id"
          value={myGraphId}
          onChange={(e) => setMyGraphId(e.target.value)}
        />

        <Button onClick={() => loadGraph(myGraphId, context)}>
          Load Graph Id
        </Button>
      </Flex>
      {loading && <Loader variant="oval" />}
      {loadError != "" ? <Text>{loadError}</Text> : null}
      <CrawlDebugDataList />
      {graph ? (
        <Stack
          p="sm"
          style={{
            border: "1px solid grey",
          }}
        >
          <Graph
            graph={graph}
            options={options}
            events={events}
            getNetwork={(network: any) => {
              setNetwork(network);
            }}
          />
          <GraphInfo graph={graph} />
          <SearchVertice graph={graph} network={network} />
        </Stack>
      ) : null}

      <EdgeInfo events={edgeEvents} />
    </Stack>
  );
}
