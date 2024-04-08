import { createContext } from "react";
import { defaultSnapshotContext } from "./SnapshotContext";

const defaultDiffContext = {
  state1: defaultSnapshotContext,
  state2: defaultSnapshotContext,
  diff: [],
  setDiff: (diff: Diff[]) => {},
};
const DiffContext = createContext<DiffContextInterface>(defaultDiffContext);

export default DiffContext;
