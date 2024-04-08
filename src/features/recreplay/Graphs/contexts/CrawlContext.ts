import { createContext } from "react";

const CrawlContext = createContext<CrawlContextType>({
  crawlInfo: {
    status: "unknown",
    step: 0,
  },
  setCrawlInfo: (ci: CrawlInfo) => {},
});

export default CrawlContext;
