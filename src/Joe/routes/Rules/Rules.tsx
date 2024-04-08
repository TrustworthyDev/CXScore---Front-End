import { Box } from "@mantine/core";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";

import { RulesPage } from "@/pages/Rules";
import { RulesConfiguration } from "@/pages/Rules/RulesConfiguration";
import { selectApplicationInfo } from "@/reduxStore/app/app.reducer";
import { Header } from "~/features/shared/Header/Header";

import { AppSelectionMenu } from "../../../Sameer/components/page/common/header-bar/app-selection-menu";

export interface RulesProps {}

export const Rules: React.FC<RulesProps> = () => {
  const selectedAppId = useSelector(selectApplicationInfo)?.appId;

  return (
    <>
      {selectedAppId && (
        <Box px="lg">
          <Header leftElement={<AppSelectionMenu />} />
        </Box>
        // <Paper className="flex flex-wrap items-center gap-4">
        //   <AppSelectionMenu />
        // </Paper>
      )}
      <Routes>
        <Route path="configuration" element={<RulesConfiguration />} />
        <Route path="" element={<RulesPage />} />
        <Route path="*" element={<Navigate to="/rules" />} />
      </Routes>
    </>
  );
};
