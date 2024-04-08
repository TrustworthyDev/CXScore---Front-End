import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Stack,
  Title,
  TextInput,
  Button,
  Group,
  Divider,
  LoadingOverlay,
  Container,
  Text,
  Box,
  Checkbox,
  Modal,
  NativeSelect,
  Input,
} from "@mantine/core";
import { Api, getScansData, submitScanRequest } from "@/api";
import { ScanSubType, ScanType } from "@/types/enum";
import { DesignScansTable, ScansTable } from "@/templates/Scans/ScansTable";
import { useDisclosure } from "@mantine/hooks";
import { SearchIcon } from "@/icons/Search";
import { FaSearch } from "react-icons/fa";
import {
  DesktopIcon,
  LaptopIcon,
  MobileIcon,
  TabletIcon,
} from "@/icons/Devices";
import { init } from "ramda";
import { useForm } from "react-hook-form";

const parseQuery = (search: string) => {
  return new URLSearchParams(search);
};

let DESIGN_PROFILES: DefaultScanConfig[] = [];

let devices: DefaultScanConfig[] = [
  {
    device: "mobile",
    windowSize: "360,800",
  },
  {
    device: "tablet",
    windowSize: "768,1024",
  },
  {
    device: "tablet",
    windowSize: "700,512",
  },
  {
    device: "laptop",
    windowSize: "1280,720",
  },
  {
    device: "laptop",
    windowSize: "1024,360",
  },
  {
    device: "desktop",
    windowSize: "1920,1080",
  },
  {
    device: "desktop",
    windowSize: "1500,540",
  },
];

devices.forEach((device) => {
  ["landscape", "portrait"].forEach((orientation) => {
    [1, 2].forEach((deviceScaleFactor) => {
      [16, 24].forEach((fontSize) => {
        if (
          orientation === "portrait" &&
          ["laptop", "desktop"].includes(device.device!)
        ) {
          return;
        }

        if (deviceScaleFactor === 2 && fontSize === 24) {
          return;
        }

        DESIGN_PROFILES.push({
          ...device,
          orientation: orientation as DefaultScanConfig["orientation"],
          deviceScaleFactor: deviceScaleFactor,
          defaultFontSize: fontSize,
        });
      });
    });
  });
});

export const DeviceIcon = ({ device }: { device: string }) => {
  let deviceIcon = null;
  if (device === "mobile") {
    deviceIcon = <MobileIcon />;
  } else if (device === "tablet") {
    deviceIcon = <TabletIcon />;
  } else if (device === "laptop") {
    deviceIcon = <LaptopIcon />;
  } else if (device === "desktop") {
    deviceIcon = <DesktopIcon />;
  }
  return deviceIcon;
};

interface ProfileSelectionProps {
  initialProfiles: DefaultScanConfig[];
  setInitialProfiles: (profiles: DefaultScanConfig[]) => void;
  selectedProfiles: DefaultScanConfig[];
  setSelectedProfiles: (profiles: DefaultScanConfig[]) => void;
}

const ProfileSelector: React.FC<ProfileSelectionProps> = ({
  initialProfiles,
  setInitialProfiles,
  selectedProfiles,
  setSelectedProfiles,
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  const groupByDevice = (profiles: DefaultScanConfig[]) => {
    console.log("recalculating");
    return profiles.reduce(
      (group, profile) => {
        const { device } = profile;
        if (!device) return group;
        group[device] = group[device] ?? [];
        group[device].push(profile);
        return group;
      },
      {} as Record<string, DefaultScanConfig[]>,
    );
  };

  const selectAll = () => {
    setSelectedProfiles(initialProfiles);
  };

  const handleProfileSelection = (
    profile: DefaultScanConfig,
    checked: boolean,
  ) => {
    if (checked) {
      setSelectedProfiles([...selectedProfiles, profile]);
    } else {
      setSelectedProfiles(selectedProfiles.filter((p) => p !== profile));
    }
  };

  const handleDeviceSelection = (device: string, checked: boolean) => {
    const deviceProfiles = groupedProfiles[device];
    if (checked) {
      setSelectedProfiles([
        ...selectedProfiles,
        ...deviceProfiles.filter((p) => !selectedProfiles.includes(p)),
      ]);
    } else {
      setSelectedProfiles(
        selectedProfiles.filter((p) => !deviceProfiles.includes(p)),
      );
    }
  };

  const isDeviceSelected = (device: string) => {
    const deviceProfiles = groupedProfiles[device];
    return deviceProfiles.every((p) => selectedProfiles.includes(p));
  };

  const isDeviceIndeterminate = (device: string) => {
    const deviceProfiles = groupedProfiles[device];
    return (
      deviceProfiles.some((p) => selectedProfiles.includes(p)) &&
      !isDeviceSelected(device)
    );
  };

  const { register, handleSubmit } = useForm<DefaultScanConfig>();

  const onSubmit = (data: DefaultScanConfig) => {
    const newProfile = {
      device: data.device ?? "",
      windowSize: data.windowSize ?? "",
      orientation: data.orientation as DefaultScanConfig["orientation"],
      deviceScaleFactor: data.deviceScaleFactor,
      defaultFontSize: data.defaultFontSize,
    };

    setInitialProfiles([...initialProfiles, newProfile]);
    setSelectedProfiles([...selectedProfiles, newProfile]);
    close();
  };

  const groupedProfiles = useMemo(
    () => groupByDevice(initialProfiles),
    [initialProfiles],
  );

  return (
    <Box className="relative">
      <Group>
        <Box>
          <Button onClick={open}>Add New Profile</Button>
          <Modal opened={opened} onClose={close} title="Add New Profile">
            <form onSubmit={handleSubmit(onSubmit)}>
              <NativeSelect
                label="Device"
                defaultValue={"mobile"}
                {...register("device")}
                data={[
                  { label: "Mobile", value: "mobile" },
                  { label: "Tablet", value: "tablet" },
                  { label: "Laptop", value: "laptop" },
                  { label: "Desktop", value: "desktop" },
                ]}
              />
              <TextInput
                label="Window Size"
                description="Enter window size in format width,height"
                {...register("windowSize")}
              />
              <NativeSelect
                label="Orientation"
                {...register("orientation")}
                data={[
                  { label: "Landscape", value: "landscape" },
                  { label: "Portrait", value: "portrait" },
                ]}
                defaultValue={"landscape"}
              />
              <TextInput
                type="number"
                label="Device Scale Factor"
                {...register("deviceScaleFactor")}
                description="Enter device scale factor (ex. 1, 1.5, 2)"
              />
              <TextInput
                type="number"
                label="Default Font Size"
                {...register("defaultFontSize")}
                description="Enter default font size (ex. 16, 24)"
              />
              <Button type="submit">Add Profile</Button>
            </form>
          </Modal>
        </Box>
        <Box>
          <Button onClick={selectAll}>Select All</Button>
        </Box>
      </Group>

      {Object.keys(groupedProfiles).map((device) => (
        <Stack key={device} className="py-2">
          <Group>
            <Checkbox
              label={
                <>
                  <Group>
                    <DeviceIcon device={device} />
                    <Text className="capitalize">{device}</Text>
                  </Group>
                </>
              }
              checked={isDeviceSelected(device)}
              indeterminate={isDeviceIndeterminate(device)}
              onChange={(event) =>
                handleDeviceSelection(device, event.currentTarget.checked)
              }
            />
          </Group>
          <Group className="pl-4">
            {groupedProfiles[device].map((profile, index) => (
              <Checkbox
                key={index}
                label={`${profile.windowSize} - ${profile.orientation} - Scale: ${profile.deviceScaleFactor} - Font Size: ${profile.defaultFontSize}`}
                onChange={(event) =>
                  handleProfileSelection(profile, event.currentTarget.checked)
                }
                checked={selectedProfiles.includes(profile)}
              />
            ))}
          </Group>
          <Divider />
        </Stack>
      ))}
    </Box>
  );
};

console.log(DESIGN_PROFILES);

export const APPLICATION_ID_FOR_DESIGN = "design-excellence-prototype-dev";

const submitVisualScan = async (payload: {
  url: string;
  profiles?: DefaultScanConfig[];
}) => {
  return submitScanRequest({
    scanType: ScanType.SinglePageScan,
    scanSubType: ScanSubType.RapidScan,
    scanners: ["design"],
    scanUrlList: [payload.url],
    appId: {
      id: APPLICATION_ID_FOR_DESIGN,
    },
    profiles: payload.profiles ?? DESIGN_PROFILES,
  });
};

export const DesignRoute = () => {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const allVisualScansQuery = useQuery({
    queryKey: ["visualScans"],
    queryFn: () => getScansData(APPLICATION_ID_FOR_DESIGN),
    refetchInterval: 10000,
  });

  useEffect(() => {
    const queryParams = parseQuery(location.search);
    const urlParam = queryParams.get("url");
    if (urlParam) {
      setUrl(decodeURIComponent(urlParam));
    }
  }, [location.search]);

  const [initialProfiles, setInitialProfiles] =
    useState<DefaultScanConfig[]>(DESIGN_PROFILES);

  const [selectedProfiles, setSelectedProfiles] =
    useState<DefaultScanConfig[]>(initialProfiles);

  const [opened, { open, close, toggle }] = useDisclosure();

  const submitScanMutation = useMutation({
    mutationFn: submitVisualScan,
    onSuccess: () => {
      allVisualScansQuery.refetch();
    },
  });

  const isLoading = allVisualScansQuery.isLoading;
  const isDataReady = !!allVisualScansQuery.data;

  console.log(selectedProfiles, "selectedProfiles");

  return (
    <div className="py-4">
      <div className="container mx-auto">
        <Stack>
          <Title order={1}>Design Excellence Dashboard</Title>
          <Text>
            Use this tool to scan a URL for design issues. The tool will scan
            the URL on multiple devices and orientations.
          </Text>
          <Stack className="mb-4 max-w-lg">
            <Group align="end">
              <TextInput
                label="Enter URL to scan"
                placeholder="https://example.com"
                value={url}
                className="flex-1"
                onChange={(event) => setUrl(event.currentTarget.value)}
                required
                disabled={submitScanMutation.isLoading}
              />
              <Box>
                <Modal
                  opened={opened}
                  onClose={close}
                  title="Profile Selection"
                >
                  <ProfileSelector
                    initialProfiles={initialProfiles}
                    setInitialProfiles={setInitialProfiles}
                    selectedProfiles={selectedProfiles}
                    setSelectedProfiles={setSelectedProfiles}
                  />
                </Modal>
                <Button variant="outline" onClick={open}>
                  Select Profiles ({selectedProfiles.length})
                </Button>
              </Box>
            </Group>
            <Box>
              <Button
                onClick={() => {
                  submitScanMutation.mutate({
                    url,
                    profiles: selectedProfiles,
                  });
                }}
                loading={submitScanMutation.isLoading}
                rightSection={<FaSearch className="ml-1" />}
              >
                Start Scan
              </Button>
            </Box>
          </Stack>

          {isLoading && <LoadingOverlay visible></LoadingOverlay>}
        </Stack>

        {isDataReady && (
          <>
            <Divider className="my-2" />
            <Title order={2}>Scans</Title>
            <Text>
              Click on the Scan ID to view the scan details and results.
            </Text>
            <DesignScansTable scansData={allVisualScansQuery.data} />
          </>
        )}
      </div>
    </div>
  );
};

