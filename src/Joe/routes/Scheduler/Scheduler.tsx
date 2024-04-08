import { Box } from "@mantine/core";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { SchedulerPage } from "@/pages/Scheduler";

export interface SchedulerProps {}

export const Scheduler: React.FC<SchedulerProps> = () => {
  return (
    <Box px="lg">
      <Routes>
        <Route path="" element={<SchedulerPage />} />
        <Route path="*" element={<Navigate to="/scheduler" />} />
      </Routes>
    </Box>
  );
};
