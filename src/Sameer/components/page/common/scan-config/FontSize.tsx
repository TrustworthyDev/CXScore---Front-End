import MoonIcon from "@/icons/Moon";
import { getValuesOrDefaultFromScanConfig } from "@/templates/Scans/ScanSettings";
import { Tooltip } from "@mantine/core";
import { AiOutlineFontSize } from "react-icons/ai";

export const DefaultFontSize = (scanConfig: DefaultScanConfig) => {
  const values = getValuesOrDefaultFromScanConfig(scanConfig);

  return (
    <Tooltip
      label="Default Font Size"
      events={{ focus: true, hover: true, touch: true }}
      withArrow
    >
      <div className="flex items-center justify-center gap-2">
        <AiOutlineFontSize size="32" />
        <span>
          {scanConfig.defaultFontSize?.toString() + "px" ?? "Default"}
        </span>
      </div>
    </Tooltip>
  );
};

