interface Props {}

import { useCallback, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { Box } from "@/atoms/Box";

import { AppPerformanceOverview } from "./appoverview/AppPerformanceOverView";
import PerformanceContext from "./PerformanceContext";
import { PerfScansPage } from "./submitscan/PerfScansPage";
import { PerformanceScanDetailPage } from "./urlperformance/PerformanceScanDetailPage";

export const Performance: React.FC<Props> = () => {
  const [isMobile, setIsMobile] = useState(true);

  const handleChangeDevice = useCallback((val: boolean) => {
    setIsMobile(val);
  }, []);

  return (
    <PerformanceContext.Provider
      value={{ onChangeDevice: handleChangeDevice, isMobile }}
    >
      <Box flex flexDirection="col" className="h-full py-5 pl-9 pr-14">
        <Routes>
          <Route path="/" element={<PerfScansPage />} />
          <Route path="/app/:appId" element={<AppPerformanceOverview />} />
          <Route path="/url/:scanId" element={<PerformanceScanDetailPage />} />
          <Route path="*" element={<Navigate to="/submit" />} />
        </Routes>
      </Box>
    </PerformanceContext.Provider>
  );
};
