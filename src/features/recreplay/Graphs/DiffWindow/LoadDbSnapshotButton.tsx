import { useContext, useEffect, useState } from "react";
import DiffContext from "../contexts/DiffContext";
import { Button, Flex, TextInput } from "@mantine/core";
import { openDomByDbId } from "@/api";

interface OwnerStateProps {
  ownerState: number;
}
export function LoadDbSnapshotButton({ ownerState }: OwnerStateProps) {
  const diffContext = useContext(DiffContext);
  const [domStateId, setDomStateId] = useState<string>("");
  useEffect(() => {
    let state;
    if (ownerState == 1) {
      state = diffContext?.state1;
    } else if (ownerState == 2) {
      state = diffContext?.state2;
    }
    console.log("db snapshot button look at state ", ownerState, state);
    if (state && state.stateId) {
      setDomStateId(state.stateId);
    }
  }, [diffContext]);

  // const context = useContext(SnapshotContext);
  // const { setSnapshot, setScreenshot, index } = context || {};
  const loadDbState = async () => {
    const ret = await openDomByDbId({
      id: domStateId,
      index: 1,
    });
    console.log("found searched node ", ret);
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
  };

  return (
    <Flex
      p="sm"
      w="80%"
      gap="sm"
      align="end"
      style={{
        border: "1px solid grey",
      }}
    >
      <TextInput
        style={{ width: 400 }}
        label="Dom State Id"
        value={domStateId}
        onChange={(e) => setDomStateId(e.target.value)}
      />

      <Button onClick={loadDbState}>Search</Button>
    </Flex>
  );
}
