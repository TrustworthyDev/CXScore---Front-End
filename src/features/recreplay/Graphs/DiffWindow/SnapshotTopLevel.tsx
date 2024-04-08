import { useContext, useState } from "react";
import SnapshotContext from "../contexts/SnapshotContext";
import { resolveAnnotation } from "../Graph.utils";
import { Checkbox, Flex, Stack, Text } from "@mantine/core";
import { LoadDbSnapshotButton } from "./LoadDbSnapshotButton";
import { LoadRawSnapshotButton } from "./LoadRawSnapshotButton";
import { LoadSnapshotButton } from "./LoadSnapshotButton";
import { LoadScreenshotButton } from "./LoadScreenshotButton";
import { AnnotationControl } from "./AnnotationControl";
import { SelectPath } from "./SelectPath";
import { ScreenshotWindow } from "./ScreenshotWindow";

interface SnapshotProps {
  index: number;
}

export function SnapshotTopLevel({ index }: SnapshotProps) {
  const context = useContext(SnapshotContext);
  const {
    snapshot,
    refMap,
    annotations,
    activeAnnotations,
    setActiveAnnotations,
  } = context || {};

  const [showAnnotations, setShowAnnotations] = useState<Set<string>>(
    new Set<string>()
  );

  const handleChangeShowAnnotation = (
    name: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newActiveAnnotations = { ...activeAnnotations };
    const newShowAnnotations = new Set<string>(showAnnotations);
    if (event.target.checked) {
      newShowAnnotations.add(name);
      newActiveAnnotations[name] = resolveAnnotation(
        refMap,
        (annotations || {})[name]
      );
    } else {
      newShowAnnotations.delete(name);
      delete newActiveAnnotations[name];
    }
    if (setActiveAnnotations) {
      setActiveAnnotations(newActiveAnnotations);
    }

    setShowAnnotations(newShowAnnotations);
  };

  return (
    <Stack gap="md" h="100%">
      <Stack gap="sm">
        <LoadDbSnapshotButton ownerState={index} />
        <Flex gap="sm">
          <LoadRawSnapshotButton />
          <LoadSnapshotButton />
          <LoadScreenshotButton />
        </Flex>

        <SelectPath />
      </Stack>
      {annotations && Object.entries(annotations).length > 0 ? (
        <Flex ml="sm">
          {Object.entries(annotations).map(([name, a]) => (
            <Flex m="sm" align="center" key={`key-${name}`} gap="sm">
              <Text>{name}</Text>
              <Checkbox
                checked={showAnnotations.has(name)}
                onChange={(e: any) => handleChangeShowAnnotation(name, e)}
              />
              {showAnnotations.has(name) ? (
                <AnnotationControl annotation={a} />
              ) : null}
            </Flex>
          ))}
        </Flex>
      ) : null}
      {/* <SnapshotWindow /> */}
      <ScreenshotWindow />
    </Stack>
  );
}
