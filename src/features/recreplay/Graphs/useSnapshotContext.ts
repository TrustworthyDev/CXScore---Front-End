import { useState } from "react";
import { makeRefMap } from "./Graph.utils";

export function useSnapshotContext(index: number): SnapshotContextInterface {
  const [snapshot, _setSnapshot] = useState<TNode | null>(null);
  const [url, setUrl] = useState<string>("");
  const [stateId, setStateId] = useState<string>("");
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>("");
  const [clickables, setClickables] = useState<any[] | null>(null);
  const [refMap, setRefMap] = useState({});
  const [annotations, setAnnotations] = useState<
    Record<string, DomNodeAnnotation>
  >({});
  const [activeAnnotations, setActiveAnnotations] = useState<
    Record<string, DomNodeAnnotation>
  >({});

  const setSnapshot = (r: TNode) => {
    _setSnapshot(r);
    const newRefMap = {};
    // console.log('making ref map');
    makeRefMap(r, newRefMap);
    setRefMap(newRefMap);
  };

  const addAnnotation = (name: string, a: DomNodeAnnotation) => {
    setAnnotations((prevAnnotations) => {
      const newAnnotations = {
        ...prevAnnotations,
      };
      newAnnotations[name] = a;
      // console.log(`add annotation: ${name}, `, a, newAnnotations);
      return newAnnotations;
    });
  };

  // console.log('now the annotations is ', annotations);
  return {
    index,
    url,
    setUrl,
    stateId,
    setStateId,
    snapshot,
    setSnapshot,
    clickables,
    setClickables,
    screenshot,
    setScreenshot,
    selectedPath,
    setSelectedPath,
    refMap,
    screenshotZoom: 1,
    annotations,
    setAnnotations,
    addAnnotation,
    activeAnnotations,
    setActiveAnnotations,
  };
}
