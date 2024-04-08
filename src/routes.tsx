import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { GuidedValidation } from "@/routes/GuidedValidation";
import { Rules } from "@/routes/Rules";
import { Scans } from "@/routes/Scans";
import { Scheduler } from "@/routes/Scheduler";
import { Violations } from "@/routes/Violations";

import { Performance } from "./features/performance/Performance";
import { GraphPage } from "./features/recreplay/Graphs/GraphPage";
import { RecordPage } from "./features/recreplay/record/RecordPage";
import { RecordSession } from "./features/recreplay/record/RecordSession";
import { ReplaySession } from "./features/recreplay/record/ReplaySession";
import { ProtectedLayout } from "./Sameer/components/layout/protected";
import { ProtectedGuestLayout } from "./Sameer/components/layout/ProtectedGuestLayout";
import { GuidedFilterSidebar } from "./Sameer/components/page/guided/guided-sidebar";
import { ViolationsFilterSidebar } from "./Sameer/components/page/violations/violations-filter-sidebar";
import { HomeRoute } from "./Sameer/routes/home";
import { LoginPage } from "./Sameer/routes/login";
import ChangePasswordPage from "./Suraj/pages/settings/change-password";
import ReportComponent from "./Suraj/reports/summary-reports/GenerateReports";
import { Settings } from "./Suraj/routes/settings/settings";
import { SEORoute } from "./Sameer/routes/seo";
import { DesignRoute } from "./Sameer/routes/design";
import { DesignScanResultsRoute } from "./Sameer/routes/design/results";
// import { RecordPage } from "@/pages/RecReplay/RecordPage";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={<ProtectedLayout />}>
          <Route path="home" element={<HomeRoute />} />
          <Route path="violations/*" element={<Violations />} />
          <Route path="guided-validation/*" element={<GuidedValidation />} />
          <Route path="scans/*" element={<Scans />} />
          <Route path="rules/*" element={<Rules />} />
          <Route path="scheduler/*" element={<Scheduler />} />
          <Route path="graphs" element={<GraphPage />} />
          <Route path="settings/*" element={<Settings />} />
          <Route path="change-password" element={<ChangePasswordPage />} />
          <Route path="recreplay/" element={<RecordPage />} />
          <Route path="recreplay/record-session" element={<RecordSession />} />
          <Route path="performance/*" element={<Performance />} />
          <Route
            path="recreplay/replay-session/:seqId"
            element={<ReplaySession />}
          />
          <Route path="seo" element={<SEORoute />} />
          <Route path="design" element={<DesignRoute />} />
          <Route path="design/:id" element={<DesignScanResultsRoute />} />
          <Route path="" element={<Navigate to="/violations" />} />
          <Route path="*" element={<Navigate to="/violations" />} />
        </Route>
        <Route path="/" element={<ProtectedGuestLayout />}>
          <Route path="reports/*" element={<ReportComponent />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export function SidebarRoutes() {
  return (
    <Routes>
      <Route path="violations/*" element={<ViolationsFilterSidebar />} />
      <Route path="guided-validation/*" element={<GuidedFilterSidebar />} />
      <Route path="*" element={<></>} />
    </Routes>
  );
}

