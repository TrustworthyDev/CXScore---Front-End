import { selectSelectedScan } from "@/reduxStore/app/app.reducer";
import { useSelector } from "react-redux";
import { BrowserType } from "./BrowserType";
import { DarkMode } from "./DarkMode";
import { SelectorsBlocked } from "./SelectorsBlocked";
import { Viewport } from "./Viewport";
import { Zoom } from "./Zoom";
import { Location } from "./Location";

export const SelectedScanAdvancedScanConfigSummary = () => {
  const selectedScan = useSelector(selectSelectedScan);

  if (!selectedScan || !selectedScan.config) {
    return <></>;
  }

  const scanConfig = selectedScan?.config;

  const children = [
    Viewport(scanConfig),
    BrowserType(scanConfig),
    Zoom(scanConfig),
    Location(scanConfig),
    DarkMode(scanConfig),
    SelectorsBlocked(scanConfig),
  ].filter((x) => x !== null);

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {children.length > 0 && <div>Scan Config:</div>}
      {children}
    </div>
  );
};
