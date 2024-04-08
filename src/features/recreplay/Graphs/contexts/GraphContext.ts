import { createContext } from "react";

const defaultGraphContext = {
  graph: null,
  graphId: "",
  loading: false,
  loadError: "",
  setGraph: () => {},
  setGraphId: (id: string) => {},
  crawlDebugList: [],
  setCrawlDebugList: (ci: CrawlDebugData[]) => {},
  setLoading: (b: boolean) => {},
  setLoadError: (s: string) => {},
};
const GraphContext = createContext<GraphContextInterface>(defaultGraphContext);

export default GraphContext;
