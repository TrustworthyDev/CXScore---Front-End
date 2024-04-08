import {
  Button,
  ComboboxItem,
  Popover,
  Select,
  Text,
  rem,
} from "@mantine/core";
import { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import { CircleDown } from "@/icons/CircleDown";
import { CircleUp } from "@/icons/CircleUp";
import { onChangeApplication } from "@/reduxStore/app/app.actions";
import { ViolationsActions } from "@/reduxStore/violations/violations";

import {
  useAllApplicationData,
  useSelectedAppId,
  useSelectedApplicationData,
} from "../../../../../lib/application/use-application-data";

export const AppSelectionMenu = () => {
  const selectedAppIdFromStore = useSelectedAppId();
  const dispatch = useDispatch();
  const { data: applicationData } = useAllApplicationData();

  const [opened, setOpened] = useState(selectedAppIdFromStore ? false : true);

  const selectedApplicationDataQuery = useSelectedApplicationData();

  const handleClickSelectButton = useCallback(() => {
    setOpened((v) => !v);
  }, []);

  const dropdownIcon = useMemo(
    () =>
      opened ? (
        <CircleUp
          role="presentation"
          className="fill-white !stroke-[#F86F80]"
        />
      ) : (
        <CircleDown
          role="presentation"
          className="fill-white !stroke-[#F86F80]"
        />
      ),
    [opened],
  );

  const dropdownItems = useMemo<ComboboxItem[]>(
    () =>
      applicationData
        ? [...applicationData].reverse().map(({ id, name }, index) => ({
            label: name,
            value: id ?? index,
          }))
        : [],
    [applicationData],
  );

  const handleChangeSelectedApp = useCallback(
    (val: string | null) => {
      if (val === null) {
        return;
      }
      const appInfo = applicationData?.find(({ id }) => id === val);
      if (!appInfo) {
        return;
      }
      dispatch(
        onChangeApplication({
          appInfo: {
            appId: appInfo.id,
            appName: appInfo.name,
          },
        }),
      );

      dispatch(
        ViolationsActions.SET_VIOLATION_STATE_IDS.action({
          selectedStateIds: [],
        }),
      );
      setOpened(false);
    },
    [applicationData, dispatch],
  );

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      trapFocus
      transitionProps={{ transition: "fade" }}
      position="bottom-start"
      withinPortal={false}
    >
      <Popover.Target>
        <Button
          color="accent"
          loading={selectedApplicationDataQuery.isInitialLoading}
          onClick={handleClickSelectButton}
          rightSection={dropdownIcon}
          w={rem(220)}
          justify="space-between"
        >
          <Text className="font-bold" mr="sm">
            App:
          </Text>
          <Text
            fw={500}
            truncate="end"
            c={selectedApplicationDataQuery.isError ? "red" : undefined}
          >
            {selectedApplicationDataQuery.isError
              ? "Error"
              : selectedApplicationDataQuery.data != null
                ? selectedApplicationDataQuery.data.name
                : "Select an Application"}
          </Text>
        </Button>
      </Popover.Target>
      <Popover.Dropdown w={rem(220)}>
        <Select
          aria-label="Select application"
          comboboxProps={{ withinPortal: false }}
          checkIconPosition="left"
          value={selectedApplicationDataQuery.data?.id}
          onChange={handleChangeSelectedApp}
          data={dropdownItems}
          dropdownOpened
          limit={100}
          pb={rem(180)}
          placeholder="Quick search"
          searchable
          maxDropdownHeight={rem(160)}
        />
      </Popover.Dropdown>
    </Popover>
  );
};
