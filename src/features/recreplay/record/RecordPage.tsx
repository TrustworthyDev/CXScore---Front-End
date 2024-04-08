import { Button, Stack } from "@mantine/core";
import React, { useCallback } from "react";

import { useSequenceData } from "@/api/useRequest";
import { useSimpleModal } from "@/atoms/Modal/useSimpleModal";
import Record from "~/icons/Record";

import { SequenceList } from "./SequenceList";
import StartRecordModalTemplate from "./StartRecordModalTemplate";
interface RecordPageProps {}

export const RecordPage: React.FC<RecordPageProps> = () => {
  const startRecordModalProps = useSimpleModal();
  const { data: sequenceList, isLoading } = useSequenceData();

  const handleClickStart = useCallback(() => {
    startRecordModalProps.open();
  }, [startRecordModalProps]);

  return (
    <Stack w="100%" h="100%" px="lg" py="md">
      <Button
        color="accent"
        leftSection={<Record fill="white" noShadow />}
        style={{ width: "fit-content" }}
        onClick={handleClickStart}
      >
        Start Record
      </Button>
      <SequenceList items={sequenceList || []} isLoading={isLoading} />
      <StartRecordModalTemplate modalProps={startRecordModalProps} />
    </Stack>
    // <RecordSession targetUrl="https://iiaindia.co/" />
  );
};
