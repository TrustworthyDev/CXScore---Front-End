import { Group, Text } from "@mantine/core";
import { DeviceIcon } from "~/Sameer/routes/design";

export const DeviceWindowSizeOrientation = (
  profile: ScanConfig & {
    hideDeviceIcon?: boolean;
  },
) => {
  return (
    <Group>
      {!profile.hideDeviceIcon && <DeviceIcon device={profile.device ?? ""} />}
      <Text className="capitalize">{profile.device}</Text>
      <Text>{profile.windowSize}</Text>
      <Text className="capitalize">{profile.orientation}</Text>
    </Group>
  );
};

