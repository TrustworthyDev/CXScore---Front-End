import { ZoomIcon } from "@/icons/Zoom";
import { getValuesOrDefaultFromScanConfig } from "@/templates/Scans/ScanSettings";
import { Tooltip } from "@mantine/core";

export const Zoom = (scanConfig: DefaultScanConfig) => {
  const values = getValuesOrDefaultFromScanConfig(scanConfig);

  const zoomStr = values.zoom;

  if (zoomStr === "default") {
    return null;
  }

  return (
    <Tooltip
      label="Zoom Configuration"
      events={{ focus: true, hover: true, touch: true }}
      withArrow
    >
      <div className="flex items-center justify-center gap-2">
        <ZoomIcon height={30} width={30} />
        <span>{zoomStr}</span>
      </div>
    </Tooltip>
  );
};
