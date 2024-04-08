type CrawlDebugData = {
  graphId: string;
  step: number;
  action: object;
  stateId: string;
  exactStateId?: string;
};

type DomNodeDesc = {
  name?: string;
  path?: string;
  bounds?: number[];
};

type TNode = {
  id: number;
  name: string;
  value: string;
  path?: string;
  parent?: TNode | null;
  children: TNode[];
  attributes: string;
  attributeMap: Record<string, string>;
  bounds: number[];
  selector?: string;
  currentStyle?: Record<string, string>;
};

type Diff = {
  path: string;
  state1Path?: string;
  state2Path?: string;
};

type DomNodeAnnotation = {
  type: string;
  color: string;
  data: DomNodeDesc[];
};

interface GraphContextInterface {
  graph: any;
  graphId: string;
  loading: boolean;
  loadError: string;
  setGraphId: (id: string) => void;
  setGraph: (g: any) => void;
  crawlDebugList: CrawlDebugData[];
  setCrawlDebugList: (cl: CrawlDebugData[]) => void;
  setLoading: (b: boolean) => void;
  setLoadError: (s: string) => void;
}

interface SnapshotContextInterface {
  index: number;
  stateId: string | undefined;
  setStateId: (i: string) => void;
  url: string | undefined;
  setUrl: (u: string) => void;
  snapshot: TNode | null;
  setSnapshot: (s: TNode) => void;

  // this will be obsolete by the new "annotations"
  clickables: any[] | null;
  setClickables: (c: any[]) => void;

  activeAnnotations: Record<string, DomNodeAnnotation>;
  setActiveAnnotations: (r: Record<string, DomNodeAnnotation>) => void;

  annotations: Record<string, DomNodeAnnotation>;
  setAnnotations: (r: Record<string, DomNodeAnnotation>) => void;
  addAnnotation: (n: string, a: DomNodeAnnotation) => void;

  screenshot: string | null;
  setScreenshot: (s: string) => void;
  selectedPath: string | null;
  setSelectedPath: (s: string) => void;
  // the reference for the tree item, used to scroll tree
  // item in the view
  refMap: Record<string, any>;
  screenshotZoom: number;
}

interface DiffContextInterface {
  state1: SnapshotContextInterface;
  state2: SnapshotContextInterface;
  diff: Diff[];
  setDiff: (s: Diff[]) => void;
}

interface CrawlContextType {
  crawlInfo: CrawlInfo | undefined;
  setCrawlInfo: (ci: CrawlInfo) => void;
}

type CrawlInfo = {
  status: string;
  step: number;
  breakpointType?: string;
  breakpointInfo?: object;
};

type UiNode = {
  path: string;
  label: string;
};