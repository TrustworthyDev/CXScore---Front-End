import MoonIcon from "@/icons/Moon";
import { getValuesOrDefaultFromScanConfig } from "@/templates/Scans/ScanSettings";
import { Tooltip } from "@mantine/core";

export const DarkMode = (scanConfig: DefaultScanConfig) => {
  const values = getValuesOrDefaultFromScanConfig(scanConfig);

  const darkMode = values.darkMode;

  if (["default", "off"].includes(darkMode ?? "off")) {
    return null;
  }

  return (
    <Tooltip
      label="Dark Mode Configuration"
      events={{ focus: true, hover: true, touch: true }}
      withArrow
    >
      <div className="flex items-center justify-center gap-2">
        <MoonIcon role="presentation" height={30} width={30} />
        <span>Dark mode enabled</span>
      </div>
    </Tooltip>
  );
};
