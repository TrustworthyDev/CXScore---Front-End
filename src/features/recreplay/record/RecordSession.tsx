import { Button, Flex, Stack, Text } from "@mantine/core";
import React, { useCallback, useEffect, useState } from "react";
import { EventSequence } from "./EventSequence";
import Record from "~/icons/Record";
import Stop from "~/icons/Stop";
import { useLocation, useNavigate } from "react-router-dom";
import Confirmation from "@/atoms/Modal/Confirmation";
import { useConfirmModal } from "@/atoms/Modal/useConfirmModal";
import { ModalHeader } from "@/atoms/Modal";
import { createEventSequence } from "@/api";

interface RecordSessionProps {}

type NavigationState = {
  sequenceName: string;
  baseUrl: string;
  startDate: string;
};
export const RecordSession: React.FC<RecordSessionProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = location.state as NavigationState;
  const [eventSequence, setEventSequene] = useState<BrowserEvent[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const stopRecordModal = useConfirmModal<ApiSequenceDetail>();

  const handleStartRecord = useCallback(() => {
    setIsRecording(true);
    const recordEvent = new CustomEvent("rnrMainEvent", {
      detail: {
        type: "START_RNR",
        mode: "RECORD",
        url: navState.baseUrl,
      },
    });
    window.dispatchEvent(recordEvent);
    setEventSequene([
      {
        type: "navigate",
        url: navState.baseUrl,
      },
    ]);
  }, [navState.baseUrl]);

  const handleEventRecordMessage = useCallback((event: CustomEvent) => {
    const recordedEvent = event.detail as BrowserEvent;
    setEventSequene((seq) => {
      const lastEvent = seq[seq.length - 1];
      if (
        lastEvent.type === "change" &&
        recordedEvent.type === "change" &&
        JSON.stringify(lastEvent.selectorOptions) ===
          JSON.stringify(recordedEvent.selectorOptions)
      ) {
        return [...seq.slice(0, seq.length - 1), recordedEvent];
      }
      return [...seq, recordedEvent];
    });
  }, []);

  useEffect(() => {
    window.addEventListener(
      "rnrRecordEvent",
      handleEventRecordMessage as EventListener
    );
    return () => {
      window.removeEventListener(
        "rnrRecordEvent",
        handleEventRecordMessage as EventListener
      );

      const recordEvent = new CustomEvent("rnrMainEvent", {
        detail: {
          type: "STOP_RNR",
        },
      });
      window.dispatchEvent(recordEvent);
    };
  }, [handleEventRecordMessage]);

  const handleStopRecord = useCallback(() => {
    const sequenceDetail: ApiSequenceDetail = {
      id: "",
      name: navState.sequenceName,
      eventSequence,
    };
    stopRecordModal.open({
      data: sequenceDetail,
      confirmCallback: () => {
        const recordEvent = new CustomEvent("rnrMainEvent", {
          detail: {
            type: "STOP_RNR",
          },
        });
        window.dispatchEvent(recordEvent);
        createEventSequence(sequenceDetail).then(() => {
          stopRecordModal.close();
          navigate("/recreplay");
        });
      },
    });
  }, [eventSequence, navState.sequenceName, navigate, stopRecordModal]);

  const handleSetState = useCallback((index: number, checked: boolean) => {
    setEventSequene((seq) => [
      ...seq.slice(0, index),
      { ...seq[index], tag: checked ? "create_state" : undefined },
      ...seq.slice(index + 1),
    ]);
  }, []);

  return (
    <Stack w="100%" h="100%" gap="0">
      <Flex justify="space-between" px="md" py="xs">
        <Text>{`Session Started: ${navState.startDate}`}</Text>
        <Flex align="center" gap="xs" style={{ svg: { fill: "red" } }}>
          <Record noShadow />
          <Text>Recording in progress</Text>
        </Flex>
      </Flex>
      <Flex
        justify="space-between"
        align="center"
        px="xl"
        py="xs"
        style={{ borderTopWidth: "1px", borderBottomWidth: "1px" }}
      >
        {isRecording ? (
          <Button
            variant="white"
            leftSection={<Stop noShadow fill="red" />}
            onClick={handleStopRecord}
          >
            Stop Recording
          </Button>
        ) : (
          <Button
            variant="white"
            leftSection={<Stop noShadow fill="red" />}
            onClick={handleStartRecord}
          >
            Start Recording
          </Button>
        )}
        <Stack align="flex-end" gap="xxs">
          <Text>App Name</Text>
          <Text>{`Sequence Name: ${navState.sequenceName}`}</Text>
        </Stack>
      </Flex>
      <Flex style={{ flex: 1, height: 0 }} gap="md">
        <EventSequence
          eventSequence={eventSequence}
          onSetState={handleSetState}
        />
      </Flex>

      <Confirmation
        {...stopRecordModal.props}
        confirmationLabel={"Stop & Save"}
        color="danger"
        header={<ModalHeader title={"Stop Recording"} />}
      >
        Do you want to stop recording and add this event sequence?
      </Confirmation>
    </Stack>
  );
};
