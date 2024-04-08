import { WarningIcon } from "@/icons/Warning";
import HeadingOne from "../../../Suraj/component/common/headings/HeadingOne";
import HeadingThree from "../../../Suraj/component/common/headings/HeadingThree";
import ScanSettingsSelectorTable, {
  tableData as scanSettingsSelectorTableData,
} from "./ScanSettingsTable";
import { FC, useCallback, useEffect, useState } from "react";
import { useApplicationData } from "../../../Sameer/lib/application/use-application-data";
import { updateApp } from "@/api";
import { Settings } from "@/icons/Settings";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Divider,
  Group,
  LoadingOverlay,
  Modal,
  NativeSelect,
  Radio,
  Text,
  Title,
} from "@mantine/core";
import { ZoomIcon } from "@/icons/Zoom";
import { AddLocationIcon } from "@/icons/AddLocation";
import {
  DesktopIcon,
  LaptopIcon,
  MobileIcon,
  TabletIcon,
} from "@/icons/Devices";
import { Controller, useForm } from "react-hook-form";

import COUNTRY_LIST from "../../../Sameer/lookup/countries.json";
import VIEWPORTS from "../../../Sameer/lookup/viewports.json";
import { useDisclosure } from "@mantine/hooks";
import { useQueryClient } from "@tanstack/react-query";
import MoonIcon from "@/icons/Moon";

const CountrySelectData = COUNTRY_LIST.map((item) => ({
  label: item.country,
  value: item["Alpha-2 code"],
}));

interface ScanSettingsProps {
  selectedAppId: string | undefined;
}

type AdvancedScanConfigFormData = {
  browserType: "default" | "chrome" | "firefox" | "edge" | "safari";
  orientation: "default" | "portrait" | "landscape";
  viewport: "default" | "desktop" | "laptop" | "mobile" | "tablet";
  selectedDesktopIndex: number;
  selectedLaptopIndex: number;
  selectedMobileIndex: number;
  selectedTabletIndex: number;
  zoom: "default" | "50%" | "100%" | "200%" | "400%";
  location: string;
  darkMode: "default" | "on" | "off";
};

const defaultValues: AdvancedScanConfigFormData = {
  browserType: "default",
  orientation: "default",
  viewport: "default",
  selectedDesktopIndex: 0,
  selectedLaptopIndex: 0,
  selectedMobileIndex: 0,
  selectedTabletIndex: 0,
  zoom: "default",
  location: "default",
  darkMode: "default",
};

export const getValuesOrDefaultFromScanConfig = (
  defaultScanConfig: DefaultScanConfig
) => {
  let result: Partial<
    {
      scanSelectorSettings: scanSettingsSelectorTableData[];
    } & AdvancedScanConfigFormData
  > = {};

  const scanSelectorSettings =
    defaultScanConfig?.blockConfig?.selectors?.map((item, index) => ({
      id: String(index),
      selector: item,
    })) ?? [];

  result = {
    ...result,
    scanSelectorSettings,
  };

  // set other fields
  const windowSize = defaultScanConfig?.windowSize;
  let orientation: AdvancedScanConfigFormData["orientation"] | null = null;
  let viewport: AdvancedScanConfigFormData["viewport"] | null = null;
  const [width, height] = windowSize?.split(",") ?? [null, null];

  if (width && height) {
    // get orientation from window size
    orientation = Number(width) > Number(height) ? "landscape" : "portrait";

    result = {
      ...result,
      orientation,
    };

    let currentViewportIndex = -1;
    Object.keys(VIEWPORTS).some((testViewport) => {
      const match = VIEWPORTS[testViewport as keyof typeof VIEWPORTS].findIndex(
        (item) =>
          (item.width === Number(width) && item.height === Number(height)) ||
          (item.height === Number(width) && item.width === Number(height))
      );

      if (match !== -1) {
        viewport = testViewport as keyof typeof VIEWPORTS;
        currentViewportIndex = match;
        return true; // shortcircuit after match is found
      }
      return false;
    });

    if (viewport && currentViewportIndex !== -1) {
      // viewport is "never", so explicitly typecast it to string
      const currentViewport: string = viewport;
      result.viewport = viewport;
      const selectedViewportIndexKey = `selected${currentViewport
        .charAt(0)
        .toUpperCase()}${currentViewport.slice(1)}Index`;

      result = {
        ...result,
        orientation,
        viewport,
        [selectedViewportIndexKey]: currentViewportIndex,
      };
    }
  } else {
    result = {
      ...result,
      orientation: defaultValues.orientation,
      viewport: defaultValues.viewport,
      selectedDesktopIndex: defaultValues.selectedDesktopIndex,
      selectedLaptopIndex: defaultValues.selectedLaptopIndex,
      selectedMobileIndex: defaultValues.selectedMobileIndex,
      selectedTabletIndex: defaultValues.selectedTabletIndex,
    };
  }

  let zoomValue = defaultScanConfig?.deviceScaleFactor ?? "default";

  if (zoomValue !== "default") {
    zoomValue = Number(zoomValue) * 100;
  }

  let zoom: "default" | "50%" | "100%" | "200%" | "400%";

  if (zoomValue === 50) {
    zoom = "50%";
  } else if (zoomValue === 100) {
    zoom = "100%";
  } else if (zoomValue === 200) {
    zoom = "200%";
  } else if (zoomValue === 400) {
    zoom = "400%";
  } else {
    zoom = "default";
  }

  result = {
    ...result,
    zoom,
  };

  const location = defaultScanConfig?.emulateGeoLocation;
  if (location) {
    const matchingCountry = COUNTRY_LIST.find(
      (item) =>
        item.lat === location.latitude && item.long === location.longitude
    );
    if (matchingCountry) {
      result = {
        ...result,
        location: matchingCountry["Alpha-2 code"] ?? "default",
      };
    }
  }

  const darkMode = defaultScanConfig?.darkMode ?? "default";

  if (darkMode !== "default") {
    result.darkMode = darkMode ? "on" : "off";
  } else {
    result.darkMode = "default";
  }

  const browserType = defaultScanConfig?.browserType ?? "default";

  result = {
    ...result,
    browserType,
  };

  return result;
};

const ScanSettings: FC<ScanSettingsProps> = ({ selectedAppId }) => {
  const appDataQuery = useApplicationData({ appId: selectedAppId ?? "" });
  const queryClient = useQueryClient();

  const { register, handleSubmit, setValue, reset, control } =
    useForm<AdvancedScanConfigFormData>({
      defaultValues,
    });

  const [scanSelectorsSettingData, setScanSelectorsSettingData] = useState<
    scanSettingsSelectorTableData[]
  >([]);

  const [loading, setLoading] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    const viewportDimensions = {
      default: {
        width: null,
        height: null,
      },
      desktop: VIEWPORTS.desktop[data.selectedDesktopIndex],
      laptop: VIEWPORTS.laptop[data.selectedLaptopIndex],
      mobile: VIEWPORTS.mobile[data.selectedMobileIndex],
      tablet: VIEWPORTS.tablet[data.selectedTabletIndex],
    }[data.viewport as keyof typeof VIEWPORTS];

    const orientation =
      data.orientation === "default" ? null : data.orientation;

    const [width, height] =
      orientation === "landscape"
        ? [viewportDimensions.height, viewportDimensions.width]
        : [viewportDimensions.width, viewportDimensions.height];

    const windowSize = width && height ? `${width},${height}` : undefined;

    const { lat, long } =
      COUNTRY_LIST.find((item) => item["Alpha-2 code"] === data.location) ??
      COUNTRY_LIST[0];

    const emulateGeoLocation =
      data.location === "default"
        ? undefined
        : { latitude: lat, longitude: long };

    const deviceScaleFactor =
      data.zoom === "default"
        ? undefined
        : Number(data.zoom.replace("%", "")) / 100;

    const darkMode =
      data.darkMode === "default" ? undefined : data.darkMode === "on";

    const browserType =
      data.browserType === "default" ? undefined : data.browserType;

    const blockConfig =
      scanSelectorsSettingData.length > 0
        ? { selectors: scanSelectorsSettingData.map((item) => item.selector) }
        : undefined;

    const payload: Partial<ApiApplicationInfo> = {
      defaultScanConfig: {
        windowSize,
        emulateGeoLocation,
        deviceScaleFactor,
        darkMode,
        browserType,
        blockConfig,
      },
    };

    // remove undefined keys
    Object.keys(payload).forEach(
      (key) =>
        payload[key as keyof typeof payload] === undefined &&
        delete payload[key as keyof typeof payload]
    );

    try {
      setLoading(true);
      await updateApp(selectedAppId ?? "", payload);
      toast.success("Settings updated successfully");
      queryClient.invalidateQueries(["application", selectedAppId]);
      close();
    } catch (error) {
      toast.error("Error updating advanced settings");
    } finally {
      setLoading(false);
    }
  });

  const syncLatestSettings = useCallback(() => {
    if (selectedAppId) {
      queryClient.invalidateQueries(["application", selectedAppId]);
    }

    reset(defaultValues);

    // reset the table
    setScanSelectorsSettingData([]);

    if (!appDataQuery.isSuccess) {
      return;
    } else {
      const defaultScanConfig = appDataQuery?.data?.defaultScanConfig;

      const config = getValuesOrDefaultFromScanConfig(defaultScanConfig ?? {});

      if (config.orientation) {
        setValue("orientation", config.orientation);
      }

      if (config.viewport) {
        setValue("viewport", config.viewport);
      }
      if (config.selectedDesktopIndex) {
        setValue("selectedDesktopIndex", config.selectedDesktopIndex);
      }

      if (config.selectedLaptopIndex) {
        setValue("selectedLaptopIndex", config.selectedLaptopIndex);
      }

      if (config.selectedMobileIndex) {
        setValue("selectedMobileIndex", config.selectedMobileIndex);
      }

      if (config.selectedTabletIndex) {
        setValue("selectedTabletIndex", config.selectedTabletIndex);
      }

      if (config.zoom) {
        setValue("zoom", config.zoom);
      }

      if (config.location) {
        setValue("location", config.location);
      }

      if (config.darkMode) {
        setValue("darkMode", config.darkMode);
      }

      if (config.browserType) {
        setValue("browserType", config.browserType);
      }

      if (config.scanSelectorSettings) {
        setScanSelectorsSettingData(config.scanSelectorSettings);
      }
    }
  }, [
    appDataQuery?.data?.defaultScanConfig,
    appDataQuery.isSuccess,
    queryClient,
    reset,
    selectedAppId,
    setValue,
  ]);

  useEffect(() => {
    // don't update the form values if the app data query
    if (appDataQuery.isLoading || !appDataQuery.isSuccess) {
      return;
    }

    try {
      syncLatestSettings();
    } catch (e) {
      toast.error("Latest settings could not be synced");
    }
  }, [
    appDataQuery.data,
    appDataQuery.isSuccess,
    appDataQuery.isLoading,
    syncLatestSettings,
  ]);

  const [opened, { open, close }] = useDisclosure(false);

  const onClose = () => {
    // cancel behaviour will be consistent with initial state of the form
    syncLatestSettings();
    close();
  };

  const onClear = () => {
    reset(defaultValues);
    setScanSelectorsSettingData([]);
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        size="auto"
        title="Advanced Settings"
      >
        {selectedAppId ? (
          <>
            <LoadingOverlay visible={appDataQuery.isLoading || loading} />
            <div className="flex items-center bg-[#c8c8c8] bg-opacity-20 px-8 py-4">
              <WarningIcon />
              <div className="text-[#545454]">
                <span className="font-bold">Warning! </span>Modifying these
                settings will have direct impact on the scan.{" "}
                <span>For Advanced Users Only.</span>
              </div>
            </div>
            <div className="space-y-4">
              <form onSubmit={onSubmit}>
                <div className="grid-cols-12 py-4 md:grid">
                  <div className="col-span-8 space-y-4 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Title order={2} fw={500}>
                          Scan Viewport & Orientation
                        </Title>
                      </div>
                    </div>
                    <div className="">
                      <div className="mb-4">
                        Select a orientation from below to run a scan on
                      </div>
                      <Controller
                        control={control}
                        name="orientation"
                        render={({
                          field: {
                            value: orientation,
                            onChange: setOrientation,
                          },
                        }) => (
                          <Radio.Group
                            name="scanOrientation"
                            value={orientation}
                            onChange={setOrientation}
                            required
                            aria-label="Select Scan orientation"
                          >
                            <div className="flex items-center space-x-4">
                              <Radio
                                value="portrait"
                                label="Portrait"
                                aria-label="Scan orientation: Portrait"
                              />
                              <Radio
                                value="landscape"
                                label="Landscape"
                                aria-label="Scan orientation: Landscape"
                              />
                            </div>
                          </Radio.Group>
                        )}
                      ></Controller>
                    </div>
                    <Controller
                      name="viewport"
                      control={control}
                      render={({
                        field: { value: viewport, onChange: setViewport },
                      }) => (
                        <Radio.Group
                          name="scanViewport"
                          value={viewport}
                          onChange={setViewport}
                          required
                          aria-label="Select Scan viewport"
                        >
                          <div className="grid-cols-12 sm:grid sm:gap-2">
                            <div className="col-span-12 pt-2 pb-4">
                              Select a viewport from below to run a scan on
                            </div>
                            <div className="flex flex-col items-center space-y-4 border-r sm:col-span-6 md:col-span-3">
                              <div className="rounded-md border border-dashed border-gray-400 px-4 py-2">
                                Desktop
                              </div>
                              <DesktopIcon height={"50px"} width={"100%"} />
                              <NativeSelect
                                data={VIEWPORTS.desktop.map((item, index) => ({
                                  label:
                                    item.label +
                                    ` (${item.width}x${item.height})`,
                                  value: index.toString(),
                                }))}
                                {...register("selectedDesktopIndex")}
                              ></NativeSelect>
                              <Radio
                                value="desktop"
                                aria-label="Scan viewport: Desktop"
                              />
                            </div>
                            <div className="flex flex-col items-center space-y-4 border-r sm:col-span-6 md:col-span-3">
                              <div className="rounded-md border border-dashed border-gray-400 px-4 py-2">
                                Laptop
                              </div>
                              <LaptopIcon height={"50px"} width={"100%"} />
                              <NativeSelect
                                data={VIEWPORTS.laptop.map((item, index) => ({
                                  label:
                                    item.label +
                                    ` (${item.width}x${item.height})`,
                                  value: index.toString(),
                                }))}
                                placeholder="Select a laptop size"
                                {...register("selectedLaptopIndex")}
                              ></NativeSelect>
                              <Radio
                                value="laptop"
                                aria-label="Scan viewport: Laptop"
                              />
                            </div>
                            <div className="flex flex-col items-center space-y-4 border-r sm:col-span-6 md:col-span-3">
                              <div className="rounded-md border border-dashed border-gray-400 px-4 py-2">
                                Mobile
                              </div>
                              <MobileIcon height={"50px"} width={"100%"} />
                              <NativeSelect
                                data={VIEWPORTS.mobile.map((item, index) => ({
                                  label:
                                    item.label +
                                    ` (${item.width}x${item.height})`,
                                  value: index.toString(),
                                }))}
                                placeholder="Select a mobile size"
                                {...register("selectedMobileIndex")}
                              ></NativeSelect>
                              <Radio
                                value="mobile"
                                aria-label="Scan viewport: Mobile"
                              />
                            </div>
                            <div className="flex flex-col items-center space-y-4 sm:col-span-6 md:col-span-3">
                              <div className="rounded-md border border-dashed border-gray-400 px-4 py-2">
                                Tablet
                              </div>
                              <TabletIcon height={"50px"} width={"100%"} />
                              <NativeSelect
                                data={VIEWPORTS.tablet.map((item, index) => ({
                                  label:
                                    item.label +
                                    ` (${item.width}x${item.height})`,
                                  value: index.toString(),
                                }))}
                                placeholder="Select a tablet size"
                                {...register("selectedTabletIndex")}
                              ></NativeSelect>
                              <Radio
                                value="tablet"
                                aria-label="Scan viewport: Tablet"
                              />
                            </div>
                          </div>
                        </Radio.Group>
                      )}
                    />
                    <div className="space-y-2">
                      <Title order={2} fw={500}>
                        Browser Type
                      </Title>
                      <div>Select a browser type to run the scan on</div>
                      <div className="flex items-center space-x-4">
                        <Controller
                          control={control}
                          name="browserType"
                          render={({ field }) => (
                            <Radio.Group
                              {...field}
                              aria-label="Select a browser type to run the scan on"
                            >
                              <div className="flex items-center space-x-4">
                                <Radio value="chrome" label="Chrome" />
                                <Radio value="firefox" label="Firefox" />
                                <Radio value="edge" label="Edge" disabled />
                                <Radio value="safari" label="Safari" disabled />
                              </div>
                            </Radio.Group>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-4 space-y-4 border-dashed border-gray-400 p-4 md:border-l">
                    <div className="space-y-2">
                      <Title order={2} fw={500}>
                        Page force zoom
                      </Title>
                      <div>Select a zoom size for the page to be scanned</div>
                      <div className="flex items-center space-x-4">
                        <ZoomIcon height={21} width={21} />
                        <NativeSelect
                          data={[
                            {
                              value: "default",
                              label: "Select a zoom size",
                            },
                            {
                              value: "50%",
                              label: "50%",
                            },
                            {
                              value: "100%",
                              label: "100%",
                            },
                            {
                              value: "200%",
                              label: "200%",
                            },
                            {
                              value: "400%",
                              label: "400%",
                            },
                          ]}
                          placeholder="Select a zoom size for the page to be scanned"
                          {...register("zoom")}
                        ></NativeSelect>
                      </div>
                    </div>{" "}
                    <div className="space-y-2">
                      <Title order={2} fw={500}>
                        Scan Location
                      </Title>
                      <div>
                        Select a location from which you would like the scan to
                        be run
                      </div>
                      <div className="flex items-center space-x-4">
                        <AddLocationIcon height={21} width={21} />
                        <NativeSelect
                          aria-label="Select a location from which you would like the scan to be run"
                          placeholder="Select a location"
                          data={CountrySelectData}
                          {...register("location")}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Title order={2} fw={500}>
                        Dark Mode
                      </Title>
                      <div>Select whether to scan in dark mode or not</div>
                      <div className="flex items-center space-x-4">
                        <MoonIcon />
                        <Controller
                          control={control}
                          name="darkMode"
                          render={({
                            field: { value: darkMode, onChange: setDarkMode },
                          }) => (
                            <Radio.Group
                              name="darkMode"
                              value={darkMode}
                              onChange={setDarkMode}
                              aria-label="Select dark mode"
                            >
                              <div className="flex items-center space-x-4">
                                <Radio
                                  value="off"
                                  label="Off"
                                  aria-label="Dark mode: Off"
                                />
                                <Radio
                                  value="on"
                                  label="On"
                                  aria-label="Dark mode: On"
                                />
                              </div>
                            </Radio.Group>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <Box px="xl">
                  <Box>
                    <HeadingOne text="Dismiss/omit specified elements & selectors from scan" />
                    <HeadingThree text="Type the selectors below. i.e. “.modal”" />
                    <ScanSettingsSelectorTable
                      settingsData={scanSelectorsSettingData}
                      setSettingsData={setScanSelectorsSettingData}
                    />
                  </Box>
                  <Divider orientation="horizontal" mt="md" />
                  <Group justify="space-between" mt="xl">
                    <Button variant="outline" onClick={onClear} color="secondary">
                      Clear
                    </Button>
                    <Group>
                      <Button
                        type="submit"
                        loading={appDataQuery.isLoading}
                        disabled={appDataQuery.isLoading}
                      >
                        Save
                      </Button>
                      <Button color="secondary" onClick={onClose}>
                        Cancel
                      </Button>
                    </Group>
                  </Group>
                </Box>
              </form>
            </div>
          </>
        ) : (
          <div>An app must be set to view the advanced settings</div>
        )}
      </Modal>

      <Button
        leftSection={<Settings fill="rgb(59 130 246)" />}
        variant="light"
        onClick={open}
        size="md"
        mr="md"
      >
        Advanced Settings
      </Button>
    </>
  );
};

export default ScanSettings;
