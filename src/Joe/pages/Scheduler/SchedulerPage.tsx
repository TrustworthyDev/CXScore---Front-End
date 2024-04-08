import { Box, Button } from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { updateSchedulerActiveStatus } from "@/api";
import { useSchedulerData } from "@/api/useRequest";
import { useSimpleModal } from "@/atoms/Modal/useSimpleModal";
import { selectApplicationInfo } from "@/reduxStore/app/app.reducer";
import { CreateSchdulerModalTemplate } from "@/templates/Scheduler";
import { ScheduledScans } from "@/templates/Scheduler/ScheduledScans";
import SchedulerPageContext from "@/templates/Scheduler/SchedulerPageContext";
import { SchedulersTable } from "@/templates/Scheduler/SchedulersTable";
import { Header } from "~/features/shared/Header/Header";
import { TextHeader } from "~/features/shared/Header/TextHeader";

import { AppSelectionMenu } from "../../../Sameer/components/page/common/header-bar/app-selection-menu";

export interface SchedulerPageProps {}

export const SchedulerPage: React.FC<SchedulerPageProps> = () => {
  const location = useLocation();
  const appId = useSelector(selectApplicationInfo)?.appId;
  const schedulerQuery = useSchedulerData(appId || "");
  const createSchedulerModalProps = useSimpleModal();
  const [curActiveStatus, setCurActiveStatus] = useState({});
  const timeRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (location.state?.openSchedulerModal) {
      createSchedulerModalProps.open();
    }
  }, [createSchedulerModalProps, location.state?.openSchedulerModal]);

  const onUpdateSchedulerActiveStatus = async ({
    schedulerId,
    active,
  }: {
    schedulerId: string;
    active: boolean;
  }) => {
    setCurActiveStatus((v) => ({ ...v, [schedulerId]: active }));
    if (timeRef.current) {
      clearTimeout(timeRef.current);
    }
    timeRef.current = setTimeout(async () => {
      await updateSchedulerActiveStatus({
        schedulerId,
        active,
      });
      schedulerQuery.refetch();
    }, 300);
  };

  if (!schedulerQuery.data) {
    return <Box>...Loading</Box>;
  }

  return (
    <SchedulerPageContext.Provider
      value={{
        refetchSchedulers: schedulerQuery.refetch,
        curActiveStatus,
        onUpdateSchedulerActiveStatus,
      }}
    >
      <Box>
        <TextHeader
          title="Scheduled scans"
          rightElement={
            <Button onClick={createSchedulerModalProps.open}>
              Create Schedule
            </Button>
          }
        />
        <Header leftElement={<AppSelectionMenu />} />
        {appId && schedulerQuery.data && (
          <ScheduledScans schedulerDetail={schedulerQuery.data} />
        )}
        <SchedulersTable scheduleData={schedulerQuery.data} />
        <CreateSchdulerModalTemplate
          modalProps={createSchedulerModalProps}
          showUrlInputBox={!location.state?.openSchedulerModal}
          fileName={location.state?.fileName}
          urlList={location.state?.urlList}
          app={location.state?.app}
          refetchTable={schedulerQuery.refetch}
        />
      </Box>
    </SchedulerPageContext.Provider>
  );
};
