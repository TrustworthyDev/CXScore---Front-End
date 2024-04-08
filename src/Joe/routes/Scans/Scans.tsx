import { Box } from "@/atoms/Box";
import { ScansPage, SubmitPage, SubmitResultPage } from "@/pages/Scans";
import { TargetedPage } from "@/pages/Scans/TargetedPage";
import { selectApplicationInfo } from "@/reduxStore/app/app.reducer";
import React from "react";
import { Navigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";

export type ScansProps = {};

export const Scans: React.FC<ScansProps> = () => {
  return (
    <Box flex flexDirection="col" className="h-full py-5 pl-9 pr-14">
      <Routes>
        <Route path="" element={<ScansPage />} />
        <Route path="submit-result" element={<SubmitResultPage />} />
        <Route path="fullscan" element={<SubmitPage />} />
        <Route path="targetedscan" element={<TargetedPage />} />
        <Route path="*" element={<Navigate to="/scans" />} />
      </Routes>
    </Box>
  );
};
