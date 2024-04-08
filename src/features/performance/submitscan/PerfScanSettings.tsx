import {
  Button,
  LoadingOverlay,
  Modal,
  NativeSelect,
  Radio,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { FC, useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { updateApp } from "@/api";
import { AddLocationIcon } from "@/icons/AddLocation";
import { DesktopIcon, LaptopIcon, MobileIcon } from "@/icons/Devices";
import { Settings } from "@/icons/Settings";
import { WarningIcon } from "@/icons/Warning";
import { ZoomIcon } from "@/icons/Zoom";
import ScanSettingsSelectorTable, {
  tableData as scanSettingsSelectorTableData,
} from "~/Joe/templates/Scans/ScanSettingsTable";
import { useApplicationData } from "~/Sameer/lib/application/use-application-data";
import VIEWPORTS from "~/Sameer/lookup/viewports.json";
import HeadingOne from "~/Suraj/component/common/headings/HeadingOne";
import HeadingThree from "~/Suraj/component/common/headings/HeadingThree";
import HeadingTwo from "~/Suraj/component/common/headings/HeadingTwo";

// const RegionSelectData = REGION_LIST.map((item) => ({
//   label: item["Region Name"],
//   value: item["Region"],
// }));

interface ScanSettingsProps {
  selectedAppId: string | undefined;
}

type AdvancedPerfScanConfigFormData = {
  browserType: "default" | "chrome" | "firefox" | "edge" | "safari";
  device:
    | "default"
    | "High-End Desktop"
    | "High-End Mobile"
    | "Low-End Desktop"
    | "Mid-Tier Mobile"
    | "Low-End Mobile";
  network:
    | "default"
    | "Cable"
    | "DSL"
    | "3GSlow"
    | "3G"
    | "3GFast"
    | "4G"
    | "LTE"
    | "Edge"
    | "2G";
  location: string;
};

const defaultValues: AdvancedPerfScanConfigFormData = {
  browserType: "default",
  device: "default",
  network: "default",
  location: "default",
};

// export const getValuesOrDefaultFromScanConfig = (
//   defaultScanConfig: DefaultScanConfig,
// ) => {
//   let result: Partial<
//     {
//       scanSelectorSettings: scanSettingsSelectorTableData[];
//     } & AdvancedPerfScanConfigFormData
//   > = {};

//   const scanSelectorSettings =
//     defaultScanConfig?.blockConfig?.selectors?.map((item, index) => ({
//       id: String(index),
//       selector: item,
//     })) ?? [];

//   result = {
//     ...result,
//     scanSelectorSettings,
//   };

//   // set other fields
//   const device = defaultScanConfig?.device ?? "default";

//   result = {
//     ...result,
//     device,
//   };

//   const location = defaultScanConfig?.location;
//   result = {
//     ...result,
//     location,
//   };

//   const browserType = defaultScanConfig?.browserType ?? "default";

//   result = {
//     ...result,
//     browserType,
//   };

//   const network = defaultScanConfig?.network;
//   result = {
//     ...result,
//     network,
//   };

//   return result;
// };

const PerfScanSettings: FC<ScanSettingsProps> = ({ selectedAppId }) => {
  const appDataQuery = useApplicationData({ appId: selectedAppId ?? "" });
  const queryClient = useQueryClient();

  const { register, handleSubmit, setValue, reset, control } =
    useForm<AdvancedPerfScanConfigFormData>({
      defaultValues,
    });

  const [scanSelectorsSettingData, setScanSelectorsSettingData] = useState<
    scanSettingsSelectorTableData[]
  >([]);

  const [loading, setLoading] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    const browserType =
      data.browserType === "default" ? undefined : data.browserType;

    const blockConfig =
      scanSelectorsSettingData.length > 0
        ? { selectors: scanSelectorsSettingData.map((item) => item.selector) }
        : undefined;

    const network = data.network === "default" ? undefined : data.network;

    const device = data.device === "default" ? undefined : data.device;
    let windowSize;
    switch (device) {
      case "High-End Desktop":
        windowSize = "1536,960";
        break;
      case "Low-End Desktop":
        windowSize = "1280,720";
        break;
      case "High-End Mobile":
        windowSize = "360,740";
        break;
      case "Mid-Tier Mobile":
        windowSize = "720,1280";
        break;
      case "Low-End Mobile":
        windowSize = "720,1280";
        break;
    }

    const payload: Partial<ApiApplicationInfo> = {
      defaultScanConfig: {
        blockConfig,
        network,
        browserType,
        device,
        windowSize,
      },
    };

    // remove undefined keys
    Object.keys(payload).forEach(
      (key) =>
        payload[key as keyof typeof payload] === undefined &&
        delete payload[key as keyof typeof payload],
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
      // const defaultScanConfig = appDataQuery?.data?.defaultScanConfig;
      // const config = getValuesOrDefaultFromScanConfig(defaultScanConfig ?? {});
      // if (config.network) {
      //   setValue("network", config.network);
      // }
      // if (config.device) {
      //   setValue("device", config.device);
      // }
      // if (config.location) {
      //   setValue("location", config.location);
      // }
      // if (config.browserType) {
      //   setValue("browserType", config.browserType);
      // }
      // if (config.scanSelectorSettings) {
      //   setScanSelectorsSettingData(config.scanSelectorSettings);
      // }
    }
  }, [appDataQuery.isSuccess, queryClient, reset, selectedAppId]);

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
                          Scan Device Type
                        </Title>
                      </div>
                    </div>
                    <Controller
                      name="device"
                      control={control}
                      render={({
                        field: { value: device, onChange: setDevice },
                      }) => (
                        <Radio.Group
                          name="scanViewport"
                          value={device}
                          onChange={setDevice}
                          required
                          aria-label="Select Device"
                        >
                          <div className="grid-cols-12 sm:grid sm:gap-2">
                            <div className="col-span-12 pt-2 pb-4">
                              Select a device from below to run a scan on
                            </div>
                            <div className="flex flex-col items-center space-y-4 border-r sm:col-span-6 md:col-span-3">
                              <div className="rounded-md border border-dashed border-gray-400 px-4 py-2">
                                High-End Desktop
                              </div>
                              <LaptopIcon height={"50px"} width={"100%"} />
                              <NativeSelect
                                data={VIEWPORTS.desktop.map((item, index) => ({
                                  label:
                                    item.label +
                                    ` (${item.width}x${item.height})`,
                                  value: index.toString(),
                                }))}
                                {...register("device")}
                              ></NativeSelect>
                              <Radio
                                value="High-End Desktop"
                                aria-label="Scan device: High-End Desktop"
                              />
                            </div>
                            <div className="flex flex-col items-center space-y-4 border-r sm:col-span-6 md:col-span-3">
                              <div className="rounded-md border border-dashed border-gray-400 px-4 py-2">
                                Low-End Desktop
                              </div>
                              <DesktopIcon height={"50px"} width={"100%"} />
                              <NativeSelect
                                data={VIEWPORTS.laptop.map((item, index) => ({
                                  label:
                                    item.label +
                                    ` (${item.width}x${item.height})`,
                                  value: index.toString(),
                                }))}
                                placeholder="Select a desktop size"
                                {...register("device")}
                              ></NativeSelect>
                              <Radio
                                value="Low-End Desktop"
                                aria-label="Scan device: Low-End Desktop"
                              />
                            </div>
                            <div className="flex flex-col items-center space-y-4 border-r sm:col-span-6 md:col-span-3">
                              <div className="rounded-md border border-dashed border-gray-400 px-4 py-2">
                                High-End Mobile
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
                                {...register("device")}
                              ></NativeSelect>
                              <Radio
                                value="High-End Mobile"
                                aria-label="Scan device: High-End Mobile"
                              />
                            </div>
                            <div className="flex flex-col items-center space-y-4 sm:col-span-6 md:col-span-3">
                              <div className="rounded-md border border-dashed border-gray-400 px-4 py-2">
                                Mid-Tier Mobile
                              </div>
                              <MobileIcon height={"50px"} width={"100%"} />
                              <NativeSelect
                                data={VIEWPORTS.tablet.map((item, index) => ({
                                  label:
                                    item.label +
                                    ` (${item.width}x${item.height})`,
                                  value: index.toString(),
                                }))}
                                placeholder="Select a tablet size"
                                {...register("device")}
                              ></NativeSelect>
                              <Radio
                                value="Mid-Tier Mobile"
                                aria-label="Scan device: Mid-Tier Mobile"
                              />
                            </div>
                            <div className="flex flex-col items-center space-y-4 border-r sm:col-span-6 md:col-span-3">
                              <div className="rounded-md border border-dashed border-gray-400 px-4 py-2">
                                Low-End Mobile
                              </div>
                              <MobileIcon height={"50px"} width={"100%"} />
                              <NativeSelect
                                data={VIEWPORTS.desktop.map((item, index) => ({
                                  label:
                                    item.label +
                                    ` (${item.width}x${item.height})`,
                                  value: index.toString(),
                                }))}
                                {...register("device")}
                              ></NativeSelect>
                              <Radio
                                value="Low-End Mobile"
                                aria-label="Scan device: Low-End Mobile"
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
                        Network Throttling
                      </Title>
                      <div>
                        Select a network throttling setting for the scan
                      </div>
                      <div className="flex items-center space-x-4">
                        <ZoomIcon height={21} width={21} />
                        <NativeSelect
                          data={[
                            {
                              value: "default",
                              label: "Select a network throttling value",
                            },
                            {
                              value: "Cable",
                              label: "Cable (5/1 Mbps 28ms RTT)",
                            },
                            {
                              value: "DSL",
                              label: "DSL (1.5 Mbps/384 Kbps 50ms RTT)",
                            },
                            {
                              value: "3G",
                              label: "3G (1.6 Mbps/768 Kbps 300ms RTT)",
                            },
                            {
                              value: "3GFast",
                              label: "3G Fast (1.6 Mbps/768 Kbps 150ms RTT)",
                            },
                            {
                              value: "LTE",
                              label: "LTE (12 Mbps, 70ms RTT)",
                            },
                          ]}
                          placeholder="Select a network setting for the scan"
                          {...register("network")}
                        ></NativeSelect>
                      </div>
                    </div>{" "}
                    <div className="space-y-2">
                      <Title order={2} fw={500}>
                        Scan Location
                      </Title>
                      <div>
                        Select a round trip time latency to emulate distance
                      </div>
                      <div className="flex items-center space-x-4">
                        <AddLocationIcon height={21} width={21} />
                        <NativeSelect
                          aria-label="Select a round trip time latency to emulate distance"
                          placeholder="Select a value"
                          data={[
                            {
                              value: "default",
                              label: "Select a rtt value",
                            },
                            {
                              value: "75",
                              label: "low",
                            },
                            {
                              value: "150",
                              label: "medium",
                            },
                            {
                              value: "225",
                              label: "high",
                            },
                          ]}
                          {...register("location")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-8">
                  <HeadingOne text="Dismiss/omit specified elements & selectors from scan" />
                  <HeadingThree text="Type the selectors below. i.e. “.modal”" />
                  <ScanSettingsSelectorTable
                    settingsData={scanSelectorsSettingData}
                    setSettingsData={setScanSelectorsSettingData}
                  />
                </div>
                <div className="mx-8 mt-4 flex justify-between border-t border-gray-300 pt-4">
                  <div>
                    <Button variant="outline" onClick={onClear} color="gray">
                      Clear
                    </Button>
                  </div>
                  <div className="flex items-center justify-end space-x-4">
                    <Button
                      type="submit"
                      color="blue"
                      className="!bg-[#35ACEF]"
                      loading={appDataQuery.isLoading}
                      disabled={appDataQuery.isLoading}
                    >
                      Save
                    </Button>
                    <Button color="red" variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div>An app must be set to view the advanced settings</div>
        )}
      </Modal>

      <Button
        leftSection={<Settings fill="#BBB" />}
        // variant="light"
        onClick={open}
        className="mr-4"
        disabled
        hidden
      >
        <HeadingTwo text="Advanced Settings" />
      </Button>
    </>
  );
};

export default PerfScanSettings;
