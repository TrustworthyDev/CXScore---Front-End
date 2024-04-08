import { openDomByDbId, openGraphId, openVertexById } from "@/api";

export const loadGraph = async (id: string, gci: GraphContextInterface) => {
  const { setLoadError, setLoading, setGraph, setCrawlDebugList } = gci;
  setLoadError("");
  setLoading(true);
  const f = await openGraphId({ id });
  setLoading(false);
  console.log("open graph return ", f);
  if (f != null) {
    if (setGraph) {
      setGraph(convertToVisGraph(f.graph));
    }
    if (setCrawlDebugList) {
      setCrawlDebugList(f.crawlDebug);
    }
  } else {
    setLoadError("cannot open graph");
  }
};

function convertToVisGraph(g: any) {
  const nodeIndexMap: any = {};
  const stateIdToNodeMap: any = {};
  const nodes: any[] = [];
  const edges: any[] = [];
  let nodeIndex = 1;
  for (const v of g.vertices) {
    const n: any = {
      id: nodeIndex,
      label: v.index ? v.index.toString() : "x",
      stateId: v.stateId,
      vertexId: v.id,
      title: v.stateId,
    };
    nodeIndexMap[nodeIndex] = n;
    stateIdToNodeMap[v.stateId] = n;
    nodes.push(n);
    nodeIndex++;
  }
  let edgeIndex = 1;

  const selfReferenceCountMap: Record<number, number> = {};

  for (const e of g.edges) {
    const sourceNode = stateIdToNodeMap[e.sourceStateId];
    const targetNode = stateIdToNodeMap[e.targetStateId];
    const eeDetail = [];
    for (const ee of e.edgeEvents) {
      eeDetail.push({
        eventString: eventString(ee),
        path: ee.path,
      });
    }
    // console.log('event str is ', eeStr);
    if (sourceNode != null && targetNode != null) {
      let selfReferenceCount = 0;
      if (sourceNode.id == targetNode.id) {
        selfReferenceCount = selfReferenceCountMap[sourceNode.id] || 0;
        selfReferenceCountMap[sourceNode.id] = selfReferenceCount + 1;
      }
      const edge: any = {
        id: edgeIndex,
        label: e.index ? e.index.toString() : "x", // this is the step number in crawling
        from: sourceNode.id,
        to: targetNode.id,
        eventSequence: eeDetail,
        selfReference: {
          size: 20 + 10 * (selfReferenceCount + 1),
          angle: 3.14 / 4,
        },
      };
      edges.push(edge);
      edgeIndex++;
    }
  }
  return {
    nodes,
    edges,
  };
}

export function eventString(e: any) {
  if (!e) {
    return "";
  }
  if (e.type == "navigate") {
    return "navigate:" + e.url;
  }
  if (e.type == "input") {
    return "input: " + (e.targetLabel ?? e.selector) + ": " + e.data;
  }
  let selectorStr = "";
  if (e.selector) {
    /*
      const mv = matchMValue(e.selector);
      if (mv) {
          selectorStr = "mvalue_" + mv.value;
      } else {
          selectorStr = e.selector;
      }
      */
    selectorStr = e.selector;
  }
  let additionalInfo = "";
  if (e.type == "key") {
    additionalInfo = ":" + e.data;
  }
  return e.type + ":" + (selectorStr ?? "-") + additionalInfo;
}

// create a map from path to tnode
export function makeRefMap(n: TNode, m: Record<string, TNode>) {
  if (!n) {
    return;
  }
  if (n.path) {
    m[n.path] = n;
  }
  if (n.children) {
    for (const c of n.children) {
      makeRefMap(c, m);
    }
  }
}

export async function setStateToDiffContext(
  diffContext: any,
  stateIndex: number,
  stateId: string,
  vertexId?: string,
  addAnnotation?: boolean
) {
  // console.log('event is ', event.event);
  const state = stateIndex == 2 ? diffContext?.state2 : diffContext?.state1;
  await setStateToSnapshotContext(
    state,
    stateIndex,
    stateId,
    vertexId,
    addAnnotation
  );
}

async function setStateToSnapshotContext(
  state: SnapshotContextInterface,
  stateIndex: number,
  stateId: string,
  vertexId?: string,
  addAnnotation?: boolean
) {
  if (!state) {
    return;
  }
  const ret = await openDomByDbId({
    id: stateId,
    index: stateIndex,
  });
  // console.log(`open ${stateId} return`, ret);

  state.setSnapshot(ret?.snapshot);
  state.setScreenshot(ret?.screenshot);
  if (ret?.url) {
    state.setUrl(ret?.url);
  }
  if (ret?.stateId) {
    state.setStateId(ret?.stateId);
  }

  if (addAnnotation) {
    if (ret.clickables) {
      const cList = {
        type: "multiple",
        color: "green",
        data: ret.clickables.map((c: any) => {
          return {
            path: c.path,
            name: c.filterReason ? c.filterReason.join(",") : "",
          } as DomNodeDesc;
        }),
      };
      state.addAnnotation("clickables", cList);
      const filteredCList = {
        type: "multiple",
        color: "green",
        data: ret.clickables
          .filter((c: any) => (c.filterReason ?? []).length == 0)
          .map((c: any) => {
            return {
              path: c.path,
            } as DomNodeDesc;
          }),
      };
      state.addAnnotation("filtered clickables", filteredCList);
    }
    if (ret.hoverables) {
      const cList = {
        type: "multiple",
        color: "magenta",
        data: ret.hoverables.map((c: any) => {
          return {
            path: c.path,
            name: c.filterReason ? c.filterReason.join(",") : "",
          } as DomNodeDesc;
        }),
      };
      state.addAnnotation("hoverables", cList);
      const filteredCList = {
        type: "multiple",
        color: "green",
        data: ret.hoverables
          .filter((c: any) => (c.filterReason ?? []).length == 0)
          .map((c: any) => {
            return {
              path: c.path,
            } as DomNodeDesc;
          }),
      };
      state.addAnnotation("filtered hoverables", filteredCList);
    }

    if (vertexId) {
      await addAnnotationFromVertex(state, vertexId);
    }
  }
}

async function addAnnotationFromVertex(
  state: SnapshotContextInterface,
  vertexId: string
) {
  if (!state || !vertexId) {
    return;
  }
  const ret = await openVertexById({
    id: vertexId,
  });
  // console.log(`open extended state ${stateId} return`, ret);
  if (ret && ret.clickableVisited) {
    const fList: DomNodeDesc[] = [];
    for (let i = 0; i < ret.clickableVisited.length; i++) {
      fList.push({
        path: ret.clickableVisited[i],
      });
    }
    state.addAnnotation("clickable visited", {
      type: "multiple",
      color: "orange",
      data: fList,
    });
  }
}

export function resolveAnnotation(refMap: any, a: any) {
  if (!refMap) {
    return a;
  }
  // console.log('refMap is ', refMap);
  const newAnnotation = {
    ...a,
    data: a.data.map((n: any) => {
      return {
        ...n,
        bounds: refMap[n.path]?.bounds,
      } as DomNodeDesc;
    }),
  };
  // console.log('resolved annotation', newAnnotation);
  return newAnnotation;
}

export function getNodeByPath(
  n: TNode | null | undefined,
  path: string | null | undefined
): TNode | null {
  if (!n || !path) {
    return null;
  }
  if (n.path == path) {
    return n;
  }
  if (n.children) {
    for (const c of n.children) {
      const ret = getNodeByPath(c, path);
      if (ret) {
        return ret;
      }
    }
  }
  return null;
}

// generate a string to be used describe a tnode
const nodeLabel = (n: TNode) => {
  if (!n.name) {
    return "?";
  }
  let ret: string = n.name;

  if (n.value) {
    ret += " " + n.value.substring(0, 100);
  }
  if (n.attributes) {
    ret += " " + n.attributes.substring(0, 100);
  }
  if (n.attributeMap && n.attributeMap["style"]) {
    ret += " style=" + n.attributeMap["style"];
  }
  return ret;
};

export function getAllPaths(n: TNode): UiNode[] {
  const getAllPathRecursive = (n: TNode, res: UiNode[]) => {
    if (n.path) {
      res.push({ path: n.path, label: nodeLabel(n) });
    }
    if (n.children) {
      for (const c of n.children) {
        getAllPathRecursive(c, res);
      }
    }
  };
  const res: UiNode[] = [];
  getAllPathRecursive(n, res);
  // console.log("all paths ", res);
  return res;
}

export function DataNodeKey(index: number, path: string) {
  return `${index}-${path}`;
}
