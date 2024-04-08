import { useContext, useState } from "react";
import SnapshotContext from "../contexts/SnapshotContext";
import { ActionIcon, Button, Flex, Text } from "@mantine/core";

interface AnnotationControlProps {
  annotation: DomNodeAnnotation;
}

export function AnnotationControl(prop: AnnotationControlProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { annotation } = prop;
  const context = useContext(SnapshotContext);
  if (!context) {
    return null;
  }
  if (!annotation) {
    return null;
  }

  const { setSelectedPath } = context;
  if (annotation.type == "single") {
    const gotoSingleNode = () => {
      setSelectedPath(annotation.data[0].path!);
    };
    return (
      <ActionIcon aria-label="goto annotation" onClick={gotoSingleNode}>
        {/* <ArrowForward /> */}
      </ActionIcon>
    );
  } else if (annotation.type == "multiple") {
    const gotoCurrentNodeAndForward = () => {
      let newIndex = currentIndex + 1;
      if (newIndex >= annotation.data.length) {
        newIndex = 0;
      }
      setCurrentIndex(newIndex);
      if (newIndex < annotation.data.length) {
        setSelectedPath(annotation.data[newIndex].path!);
      }
    };
    const gotoCurrentNodeAndBackward = () => {
      let newIndex = currentIndex - 1;
      if (newIndex < 0) {
        newIndex = annotation.data.length - 1;
        if (newIndex < 0) {
          newIndex = 0;
        }
      }
      setCurrentIndex(newIndex);
      if (newIndex < annotation.data.length) {
        setSelectedPath(annotation.data[newIndex].path!);
      }
    };
    return (
      <Flex align="center">
        <Button></Button>
        <ActionIcon
          aria-label="goto annotation"
          onClick={gotoCurrentNodeAndForward}
        >
          {/* <ArrowForward /> */}
        </ActionIcon>

        <Text>{currentIndex + 1}</Text>
        <ActionIcon
          aria-label="goto annotation"
          onClick={gotoCurrentNodeAndBackward}
        >
          {/* <ArrowBack /> */}
        </ActionIcon>
      </Flex>
    );
  }
  return null;
}
