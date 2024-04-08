import { Box, Group, Title } from "@mantine/core";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import { useScansData } from "@/api/useRequest";
import { Confirmation } from "@/atoms/Confirmation";
import { selectApplicationInfo } from "@/reduxStore/app/app.reducer";
import { AppSelectionMenu } from "~/Sameer/components/page/common/header-bar/app-selection-menu";

import PerfScansPageContext from "./PerfScansPageContext";
import { PerfScansTable } from "./PerfScansTable";
import { SubmitPerfScan } from "./SubmitPerfScan";

interface Props {}

export const PerfScansPage: React.FC<Props> = () => {
  const appId = useSelector(selectApplicationInfo)?.appId;
  const scansQuery = useScansData(appId || "");

  const [confirmModalProps, setConfirmModalProps] = useState({
    content: "",
    onClickButton: (id: string) => {
      console.log(id);
    },
  });
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  return (
    <PerfScansPageContext.Provider
      value={{
        refetchScans: scansQuery.refetch,
        setIsConfirmOpen,
        setConfirmModalProps,
      }}
    >
      <Box>
        <SubmitPerfScan />
        <Box>
          <Group>
            <Title order={3}>Recent scans</Title>
            <AppSelectionMenu />
          </Group>
          {appId && scansQuery.data && (
            <PerfScansTable
              title="Scans Inventory"
              scansData={scansQuery.data.filter((v) =>
                v.config.scanners?.includes("performance"),
              )}
            />
          )}
        </Box>
      </Box>

      <Confirmation
        isOpen={isConfirmOpen}
        title="Rescan"
        content={confirmModalProps.content}
        buttonList={[
          { buttonId: "yes", buttonText: "Yes", buttonStyle: "warning" },
          { buttonId: "no", buttonText: "No", buttonStyle: "success" },
        ]}
        onRequestClose={() => setIsConfirmOpen(false)}
        onClickButton={confirmModalProps.onClickButton}
      />
    </PerfScansPageContext.Provider>
  );
};
