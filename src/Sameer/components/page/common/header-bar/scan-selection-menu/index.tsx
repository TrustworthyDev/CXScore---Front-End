import { useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useSelectedApplicationData } from "../../../../../lib/application/use-application-data";
import { Skeleton } from "../../../../atoms/loading/skeleton";
import { useDispatch, useSelector } from "react-redux";
import { onChangeSelectedScan } from "@/reduxStore/app/app.actions";
import { selectSelectedScan } from "@/reduxStore/app/app.reducer";
import TickIcon from "@/icons/Tick";
import { CircleDown } from "@/icons/CircleDown";
import { CircleUp } from "@/icons/CircleUp";
import { useScansData } from "@/api/useRequest";
import { ScanStatus, ScanType } from "@/types/enum";
import { Link } from "react-router-dom";
import { isScanComplete } from "~/Sameer/lib/scan-utils";
import {
  Box,
  Button,
  Divider,
  List,
  Popover,
  ScrollArea,
  Text,
  rem,
} from "@mantine/core";

const DEFAULT_SCAN_TYPE = ScanType.SinglePageScan;

const ScanTypeDetails: Record<
  ScanType,
  {
    label: string;
    shortLabel: string;
  }
> = {
  [ScanType.FullPageScan]: {
    label: "Full Page Scan",
    shortLabel: "FS",
  },
  [ScanType.MultiPageScan]: {
    label: "Multi Page Scan",
    shortLabel: "MS",
  },
  [ScanType.SinglePageScan]: {
    label: "Single Page Scan",
    shortLabel: "SS",
  },
  [ScanType.ViolationReScan]: {
    label: "Violation Scan",
    shortLabel: "VS",
  },
};

const capitalize = (data?: string) =>
  data ? data.charAt(0).toUpperCase() + data.slice(1) : "";

const formatScanData = (data: ApiScan) => {
  const date = new Date(data.timeStarted ?? Date.now());
  const formattedDate = date.toLocaleDateString();
  const scanSubType = data.config.scanSubType;

  let scanName = "";
  if (data.appName != data.config.scanName) {
    scanName = data.config.scanName ?? "";
  }

  return `${formattedDate} | ${scanSubType} | ${capitalize(data.status)} ${
    scanName != "" ? `| ${scanName}` : ""
  }`;
};

const ScanSelectionActionMenuGroupItem = ({
  data,
  onSelect,
  onClear,
}: {
  data: ApiScan;
  onSelect: (data: ApiScan) => void;
  onClear: () => void;
}) => {
  const selectedScanId = useSelector(selectSelectedScan)?.id ?? "";
  const isSelected = selectedScanId === data.id;

  // select specific scan
  const handleClick = () => {
    if (isSelected) {
      onClear();
    } else {
      onSelect(data);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={clsx(
        "block w-full cursor-pointer p-2 text-left text-black hover:bg-blue-200 focus:bg-blue-200",
        isSelected && "!text-blue-600"
      )}
    >
      <span>{formatScanData(data)}</span>
    </button>
  );
};

const ScanSelectionActionMenuGroup = ({
  data,
  totalCount,
  onSelect,
  onClear,
}: {
  data: ApiScan[];
  totalCount?: number;
  onSelect: (data: ApiScan) => void;
  onClear: () => void;
}) => {
  // get top 3 scans
  const filteredData = data
    .filter(isScanComplete)
    .sort((a, b) => {
      const aDate = new Date(a.timeStarted ?? Date.now());
      const bDate = new Date(b.timeStarted ?? Date.now());
      return bDate.getTime() - aDate.getTime();
    })
    .slice(0, 3);

  const details =
    filteredData.length > 0
      ? ScanTypeDetails[
          filteredData[0].config.scanType != null
            ? filteredData[0].config.scanType
            : DEFAULT_SCAN_TYPE
        ]
      : null;

  const selectedScanId = useSelector(selectSelectedScan)?.id ?? "";
  const isGroupSelected =
    data.filter((d) => d.id === selectedScanId).length > 0;

  // select top scan from group if not already selected
  const handleClick = () => {
    if (isGroupSelected) {
      onClear();
    } else {
      onSelect(filteredData[0]);
    }
  };

  if (!details) {
    return null;
  }

  return (
    <div className={clsx("block w-full space-y-0.5")}>
      <button
        className={clsx(
          " hover:text-gray-700 hover:after:block hover:after:text-sm hover:after:font-semibold hover:after:text-gray-700 hover:after:content-[attr(data-total-count)] ",
          "block w-full p-2 text-black hover:bg-blue-200"
        )}
        aria-label={`Select latest ${details.label} scan out of total ${totalCount} scans`}
        data-total-count={`Total Count: ${totalCount}`}
        onClick={handleClick}
      >
        <div className="flex items-center justify-start">
          <div className="h-4 w-6">
            {isGroupSelected ? (
              <TickIcon className="h-4 scale-75 fill-current text-blue-500" />
            ) : (
              <div className="h-4 w-4 rounded-full bg-gray-300" />
            )}
          </div>
          <div className="flex items-baseline gap-1">
            <p>{`${details.label}`}</p>
            <p>{`(${details.shortLabel})`}</p>
          </div>
        </div>
      </button>
      <ul>
        {filteredData.map((data) => (
          <li key={data.id} className="pl-8 text-xs">
            <ScanSelectionActionMenuGroupItem
              data={data}
              onSelect={onSelect}
              onClear={onClear}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

const ScanSelectionActionMenu = ({
  onSelectComplete,
}: {
  onSelectComplete: (data?: ApiScan) => void;
}) => {
  const dispatch = useDispatch();

  const {
    data: selectedApp,
    isLoading: isSelectedAppLoading,
    isError: isSelectedAppError,
  } = useSelectedApplicationData();

  const {
    data: scansData,
    isLoading,
    isError,
  } = useScansData(selectedApp?.id ?? "");

  const handleScanSelect = useCallback(
    (data: ApiScan) => {
      dispatch(
        onChangeSelectedScan({
          scan: data,
        })
      );
      onSelectComplete?.(data);
    },
    [dispatch, onSelectComplete]
  );

  const handleClearSelection = useCallback(() => {
    dispatch(
      onChangeSelectedScan({
        scan: null,
      })
    );
    onSelectComplete?.();
  }, [dispatch, onSelectComplete]);

  const itemsGroupedByType = useMemo(
    () =>
      (scansData ?? []).reduce<Record<ScanType, ApiScan[]>>((acc, data) => {
        const scanType = data.scanType ?? DEFAULT_SCAN_TYPE;
        if (!acc[scanType]) {
          acc[scanType] = [];
        }
        acc[scanType].push(data);
        return acc;
      }, {} as Record<ScanType, ApiScan[]>),
    [scansData]
  );

  const totalCountByType = useMemo(
    () =>
      (scansData ?? []).reduce<Record<ScanType, number>>((acc, data) => {
        const scanType = data.scanType ?? DEFAULT_SCAN_TYPE;
        if (!acc[scanType]) {
          acc[scanType] = 0;
        }
        acc[scanType]++;
        return acc;
      }, {} as Record<ScanType, number>),
    [scansData]
  );

  if (isLoading || isSelectedAppLoading) {
    return <Skeleton className="h-24 !w-full" />;
  }

  if (isError || isSelectedAppError) {
    return <div>Error</div>;
  }

  return (
    <Box>
      {/* <div className="flex items-center justify-between gap-2 px-2 py-1">
        <div className="text-md font-display font-semibold">Recent Scans</div>
        <Button className="!px-2 !py-1 !text-sm">Reset</Button>
      </div>
      <HorizontalSeparator className="!w-full" /> */}
      <ScrollArea h={rem(200)}>
        <List>
          {
            // if no scans, show empty state
            Object.keys(itemsGroupedByType).length === 0 && (
              <List.Item>
                <Text ta="center" c="gray" size="sm">
                  No scans available for this app
                </Text>
              </List.Item>
            )
          }
          {
            // render scans grouped by type
            Object.keys(itemsGroupedByType).map((key) => {
              const scanType = key as ScanType;
              const data = itemsGroupedByType[scanType];
              const totalCount = totalCountByType[scanType];
              return (
                <List.Item key={scanType}>
                  <ScanSelectionActionMenuGroup
                    data={data}
                    totalCount={totalCount}
                    onSelect={handleScanSelect}
                    onClear={handleClearSelection}
                  />
                </List.Item>
              );
            })
          }
        </List>
      </ScrollArea>
      <Divider orientation="horizontal" />
      <Link to="/scans">
        <Text ta="right" p="md" td="underline">
          View All
        </Text>
      </Link>
    </Box>
  );
};

export const ScanSelectionMenu = () => {
  const [opened, setOpened] = useState(false);

  const selectedAppQuery = useSelectedApplicationData();

  const selectedScan = useSelector(selectSelectedScan);
  const scansQuery = useScansData(selectedAppQuery.data?.id ?? "");

  const dispatch = useDispatch();

  const handleClickSelectButton = useCallback(() => {
    setOpened((v) => !v);
  }, []);

  const closeDropdown = useCallback(() => {
    setOpened(false);
  }, []);

  useEffect(() => {
    if (
      scansQuery.data?.length &&
      !scansQuery.isLoading &&
      !selectedAppQuery.isLoading
    ) {
      // reset selected scan if it is not in the list
      const result = scansQuery.data.find(
        (scan) => scan.id === selectedScan?.id
      );

      if (!result) {
        dispatch(
          onChangeSelectedScan({
            scan: null,
          })
        );
      }

      // select latest scan if none is selected or
      // if selected scan is not complete
      if (!selectedScan || !isScanComplete(selectedScan)) {
        const latestScan = scansQuery.data
          .filter(
            (scan) =>
              // find the first done
              scan.status === ScanStatus.Done
          )
          .sort((a, b) => {
            return (
              new Date(b.timeCompleted).getTime() -
              new Date(a.timeCompleted).getTime()
            );
          })[0];

        if (latestScan) {
          dispatch(
            onChangeSelectedScan({
              scan: latestScan,
            })
          );
        }
      }
    }
  }, [
    dispatch,
    scansQuery.data,
    scansQuery.isLoading,
    selectedAppQuery.isLoading,
    selectedScan,
  ]);

  const dropdownIcon = useMemo(
    () =>
      opened ? (
        <CircleUp
          role="presentation"
          className="fill-white !stroke-[#9483E5]"
        />
      ) : (
        <CircleDown
          role="presentation"
          className="fill-white !stroke-[#9483E5]"
        />
      ),
    [opened]
  );

  const isLoading = selectedAppQuery.isLoading || scansQuery.isLoading;
  const isError = selectedAppQuery.isError || scansQuery.isError;
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
          color="accentSecondary"
          loading={isLoading}
          onClick={handleClickSelectButton}
          rightSection={dropdownIcon}
          w={rem(300)}
          justify="space-between"
        >
          <Text className="font-bold" mr="sm">
            Scan ID:
          </Text>
          <Text fw={500} truncate="end" c={isError ? "red" : undefined}>
            {isError
              ? "Error"
              : selectedScan != null
              ? formatScanData(selectedScan)
              : "Select a Scan"}
          </Text>
        </Button>
      </Popover.Target>
      <Popover.Dropdown w={rem(300)}>
        <ScanSelectionActionMenu onSelectComplete={closeDropdown} />
      </Popover.Dropdown>
    </Popover>
  );
};

