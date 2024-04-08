import COUNTRIES_LIST from "~/Sameer/lookup/countries.json";
import { getValuesOrDefaultFromScanConfig } from "@/templates/Scans/ScanSettings";
import { AddLocationIcon } from "@/icons/AddLocation";
import { Tooltip } from "@mantine/core";

export const Location = (scanConfig: DefaultScanConfig) => {
  const values = getValuesOrDefaultFromScanConfig(scanConfig);

  const country = COUNTRIES_LIST.find(
    (country) => country["Alpha-2 code"] === values.location
  );

  if (!country || values.location === "default") {
    return null;
  }

  return (
    <Tooltip
      label="Location Configuration"
      events={{ focus: true, hover: true, touch: true }}
      withArrow
    >
      <div className="flex items-center justify-center gap-2">
        <AddLocationIcon height={30} width={30} />
        <span>{country.country}</span>
      </div>
    </Tooltip>
  );
};
