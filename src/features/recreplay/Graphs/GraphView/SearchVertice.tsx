import { useContext, useState } from "react";
import DiffContext from "../contexts/DiffContext";
import { Button, Flex, TextInput } from "@mantine/core";
import { openDomByDbId } from "@/api";

export function SearchVertice(props: any) {
  const diffContext = useContext(DiffContext);
  const [domStateId, setDomStateId] = useState<string>("");
  const { graph, network } = props;
  if (!graph) {
    return null;
  }
  const doSearchVertice = async () => {
    console.log("searching ", domStateId);
    if (!domStateId) {
      return;
    }
    for (const n of graph.nodes) {
      if (n.stateId.startsWith(domStateId)) {
        const ret = await openDomByDbId({
          id: n.stateId,
          index: 1,
        });
        console.log("found searched node ", n);
        const state = diffContext?.state1;
        if (state?.setSnapshot && ret?.snapshot) {
          state?.setSnapshot(ret?.snapshot);
        }
        if (state?.setScreenshot && ret?.screenshot) {
          state?.setScreenshot(ret?.screenshot);
        }
        if (state?.setUrl && ret?.url) {
          state?.setUrl(ret?.url);
        }
        if (state?.setStateId && ret?.stateId) {
          state?.setStateId(ret?.stateId);
        }
        network.selectNodes([n.id]);
        return;
      }
    }
  };
  return (
    <Flex
      p="sm"
      w="80%"
      align="end"
      gap="md"
      style={{
        border: "1px solid grey",
      }}
    >
      <TextInput
        style={{ width: 400 }}
        label="Dom State Id"
        value={domStateId}
        onChange={(e) => setDomStateId(e.target.value)}
      ></TextInput>

      <Button onClick={doSearchVertice}>Search</Button>
    </Flex>
  );
}
