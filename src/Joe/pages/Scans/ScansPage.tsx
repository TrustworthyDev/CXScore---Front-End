import { Box } from "@/atoms/Box";
import React, { useState } from "react";
import { RecentScans } from "@/templates/Scans";
import { useScansData } from "@/api/useRequest";
import { useSelector } from "react-redux";
import { selectApplicationInfo } from "@/reduxStore/app/app.reducer";
import ScansPageContext from "@/templates/Scans/ScansPageContext";
import { Confirmation } from "@/atoms/Confirmation";
import { SubmitScan } from "@/templates/Scans/SubmitScan";
import { Title } from "@mantine/core";

export interface ScansPageProps {}

export const ScansPage: React.FC<ScansPageProps> = () => {
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
    <ScansPageContext.Provider
      value={{
        refetchScans: scansQuery.refetch,
        setIsConfirmOpen,
        setConfirmModalProps,
      }}
    >
      <Box className="relative">
        <Title order={3}>Initiate New Scan</Title>
        <SubmitScan />

        {appId && scansQuery.data && (
          <RecentScans scansData={scansQuery.data} />
        )}
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
    </ScansPageContext.Provider>
  );
};
