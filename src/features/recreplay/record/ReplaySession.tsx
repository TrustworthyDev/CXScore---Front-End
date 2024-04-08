import {
  Button,
  Center,
  Flex,
  Loader,
  NumberInput,
  Stack,
  Text,
} from "@mantine/core";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { EventSequence } from "./EventSequence";
import { useParams } from "react-router-dom";
import { useSequenceDetail } from "@/api/useRequest";
import { toast } from "react-toastify";

interface ReplaySessionProps {}

type ReplayParams = {
  seqId: string;
};

export const ReplaySession: React.FC<ReplaySessionProps> = () => {
  const { seqId } = useParams<ReplayParams>();
  const { data: sequenceData } = useSequenceDetail({ seqId: seqId || "" });
  const timeIdRef = useRef<NodeJS.Timer>();
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [replayInterval, setReplayInterval] = useState(1000);
  const [isReplaying, setIsReplaying] = useState(false);

  const handleReplayEvent = (event: CustomEvent) => {
    const replayEvent = event.detail;

    switch (replayEvent.type) {
      case "REPLAY_RESULT": {
        const isFailed = replayEvent.status !== "OK";
        if (!isFailed) {
          setCurrentEventIndex((v) => v + 1);
        }
        return;
      }
    }
  };

  useEffect(() => {
    window.addEventListener(
      "rnrReplayEvent",
      handleReplayEvent as EventListener
    );
    return () => {
      window.removeEventListener(
        "rnrReplayEvent",
        handleReplayEvent as EventListener
      );
      const recordEvent = new CustomEvent("rnrMainEvent", {
        detail: {
          type: "STOP_RNR",
        },
      });
      window.dispatchEvent(recordEvent);
    };
  }, []);

  const handleReplay = useCallback(() => {
    clearInterval(timeIdRef.current as NodeJS.Timer);

    const recordEvent = new CustomEvent("rnrMainEvent", {
      detail: {
        type: "STOP_RNR",
      },
    });
    window.dispatchEvent(recordEvent);

    if (!sequenceData || sequenceData.eventSequence[0].type !== "navigate") {
      setIsReplaying(false);
      return;
    }
    setIsReplaying(true);
    setCurrentEventIndex(1);
    window.dispatchEvent(
      new CustomEvent("rnrMainEvent", {
        detail: {
          type: "START_RNR",
          mode: "REPLAY",
          url: sequenceData.eventSequence[0].url || "",
        },
      })
    );
    setTimeout(() => {
      timeIdRef.current = setInterval(
        () =>
          setCurrentEventIndex((v) => {
            if (sequenceData && sequenceData.eventSequence[v]) {
              const recordedEvent = sequenceData.eventSequence[v];
              window.dispatchEvent(
                new CustomEvent("rnrReplayEvent", {
                  detail: {
                    type: "REPLAY_EVENT",
                    eventData: recordedEvent,
                  },
                })
              );
              return v;
            } else {
              clearInterval(timeIdRef.current as NodeJS.Timer);
              timeIdRef.current = undefined;
              setIsReplaying(false);
              toast("Replay Completed", { type: "success" });
              return v;
            }
          }),
        replayInterval
      );
    }, 4000);
  }, [replayInterval, sequenceData]);

  if (!sequenceData) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  return (
    <Stack w="100%" h="100%" gap="0">
      <Flex style={{ alignItems: "center" }} px="md" py="xs">
        <NumberInput
          suffix="ms"
          step={100}
          value={replayInterval}
          onChange={(v) => setReplayInterval(Number(v) || 1000)}
          disabled={isReplaying}
        />
        <Button variant="white" onClick={handleReplay} loading={isReplaying}>
          Replay
        </Button>
        {isReplaying && (
          <Text>{`Event sequence ${currentEventIndex}/${sequenceData.eventSequence.length}`}</Text>
        )}
      </Flex>
      <Flex style={{ flex: 1, height: 0 }} gap="md">
        <EventSequence
          eventSequence={sequenceData.eventSequence}
          activeIndex={currentEventIndex}
        />
      </Flex>
    </Stack>
  );
};
