import { getValuesOrDefaultFromScanConfig } from "@/templates/Scans/ScanSettings";
import { TbZoomCancel } from "react-icons/tb";
import { Tooltip } from "@mantine/core";

export const SelectorsBlocked = (scanConfig: DefaultScanConfig) => {
  const values = getValuesOrDefaultFromScanConfig(scanConfig);

  const selectorsBlocked = values.scanSelectorSettings ?? [];

  if (!selectorsBlocked || selectorsBlocked.length === 0) {
    return null;
  }

  return (
    <Tooltip
      label="Selectors Blocked"
      events={{ focus: true, hover: true, touch: true }}
      withArrow
    >
      <div className="flex items-center justify-center gap-2">
        <TbZoomCancel size="26" role="presentation" />
        <span>{selectorsBlocked.length} selectors blocked</span>
      </div>
    </Tooltip>
  );
};
