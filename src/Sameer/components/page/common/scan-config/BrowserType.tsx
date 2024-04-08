import { getValuesOrDefaultFromScanConfig } from "@/templates/Scans/ScanSettings";
import { FaChrome, FaEdge, FaFirefox, FaSafari } from "react-icons/fa";
import { Tooltip } from "@mantine/core";

export const BrowserType = (scanConfig: DefaultScanConfig) => {
  const values = getValuesOrDefaultFromScanConfig(scanConfig);

  const browserType = values.browserType;

  if (!browserType || browserType === "default") {
    return null;
  }

  const icons = {
    chrome: <FaChrome size="26" aria-label="Chrome browser" />,
    firefox: <FaFirefox size="26" aria-label="Firefox browser" />,
    edge: <FaEdge size="26" aria-label="Edge browser" />,
    safari: <FaSafari size="26" aria-label="Safari browser" />,
  };

  return (
    <Tooltip
      label="Browser Type Configuration"
      events={{ focus: true, hover: true, touch: true }}
      withArrow
    >
      <div className="flex items-center justify-center gap-2 capitalize">
        {icons[browserType]}
        <span>{browserType}</span>
      </div>
    </Tooltip>
  );
};
