import Viewports from "~/Sameer/lookup/viewports.json";
import {
  DesktopIcon,
  MobileIcon,
  LaptopIcon,
  TabletIcon,
} from "@/icons/Devices";
import { getValuesOrDefaultFromScanConfig } from "@/templates/Scans/ScanSettings";
import { Tooltip } from "@mantine/core";

export const Viewport = (scanConfig: DefaultScanConfig) => {
  const values = getValuesOrDefaultFromScanConfig(scanConfig);

  const viewport = values.viewport ?? "default";
  let selectedIndex = -1;
  if (viewport === "desktop") {
    selectedIndex = values.selectedDesktopIndex ?? 0;
  } else if (viewport === "mobile") {
    selectedIndex = values.selectedMobileIndex ?? 0;
  } else if (viewport === "laptop") {
    selectedIndex = values.selectedLaptopIndex ?? 0;
  } else if (viewport === "tablet") {
    selectedIndex = values.selectedTabletIndex ?? 0;
  } else {
    selectedIndex = -1;
  }

  if (viewport === "default") {
    return null;
  }

  const { height, width, label } = Viewports[viewport][selectedIndex];

  if (!height || !width) {
    return null;
  }

  const icons = {
    desktop: DesktopIcon,
    mobile: MobileIcon,
    laptop: LaptopIcon,
    tablet: TabletIcon,
  };

  const orientation = values.orientation ?? "default";

  const doRotate =
    orientation === "landscape" && ["mobile", "tablet"].includes(viewport);

  return (
    <Tooltip
      label="Viewport Configuration"
      events={{ focus: true, hover: true, touch: true }}
      withArrow
    >
      <div className="flex items-center justify-center gap-2 capitalize">
        {icons[viewport]({
          height: 30,
          width: 30,
          className: doRotate ? "transform rotate-90" : "",
          "aria-label": `Image of ${viewport} ${
            doRotate ? ", in landscape mode" : ""
          }`,
        })}
        {label != "" && (
          <span>
            {label} ({width}x{height},{" "}
            {orientation !== "default" && orientation})
          </span>
        )}
      </div>
    </Tooltip>
  );
};

