import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import { ViolationDetailsPage } from "@/pages/Violations";
import ViolationsPage from "../../../Sameer/routes/violations";

export type ViolationsProps = {};

export const Violations: React.FC<ViolationsProps> = () => {
  return (
    <Routes>
      <Route path="details/:violationID" element={<ViolationDetailsPage />} />
      <Route path="" element={<ViolationsPage />} />
      <Route path="*" element={<Navigate to="/violation" />} />
    </Routes>
  );
};
