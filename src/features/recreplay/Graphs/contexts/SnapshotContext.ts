/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { createContext } from "react";

export const defaultSnapshotContext = {
  index: 1,
  url: undefined,

  setUrl: (u: string) => {},
  stateId: undefined,
  setStateId: (i: string) => {},
  snapshot: null,
  setSnapshot: (n: TNode) => {},

  clickables: null,
  setClickables: (n: any) => {},

  annotations: {},
  setAnnotations: (r: Record<string, DomNodeAnnotation>) => {},
  addAnnotation: (n: string, a: DomNodeAnnotation) => {},

  activeAnnotations: {},
  setActiveAnnotations: (r: Record<string, DomNodeAnnotation>) => {},

  screenshot: null,
  setScreenshot: (s: string) => {},
  selectedPath: null,
  setSelectedPath: (p: string) => {},
  refMap: {},
  screenshotZoom: 1,
};

const SnapshotContext = createContext<SnapshotContextInterface>(
  defaultSnapshotContext
);

export default SnapshotContext;
