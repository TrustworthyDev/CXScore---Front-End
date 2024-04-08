import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Skeleton } from "../../../../atoms/loading/skeleton";
import { useDispatch, useSelector } from "react-redux";
import {
  onChangeSelectedScan,
  onChangeSelectedScheduler,
} from "@/reduxStore/app/app.actions";
import {
  selectApplicationInfo,
  selectSelectedScheduler,
} from "@/reduxStore/app/app.reducer";
import TickIcon from "@/icons/Tick";
import { CircleDown } from "@/icons/CircleDown";
import { CircleUp } from "@/icons/CircleUp";
import { useSchedulerData } from "@/api/useRequest";
import { ScanSubType, ScanType } from "@/types/enum";
import { useOnClickOutside } from "../../../../../lib/util/use-on-click-outside";
import { useKeydown } from "../../../../../lib/util/use-keydown";
import { HorizontalSeparator } from "../../../../atoms/seperator/horizontal-separator";
import { Link } from "react-router-dom";

interface AppSelectionBarProps {}

const DEFAULT_SCAN_TYPE = ScanType.MultiPageScan;

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

const ScanSubTypeDetails: Record<
  ScanSubType,
  {
    label: string;
    shortLabel: string;
  }
> = {
  [ScanSubType.DeepScan]: {
    label: "Deep Scan",
    shortLabel: "DS",
  },
  [ScanSubType.RapidScan]: {
    label: "Rapid Scan",
    shortLabel: "RS",
  },
  [ScanSubType.FullScan]: {
    label: "Full Scan",
    shortLabel: "FS",
  },
  [ScanSubType.PriorityScan]: {
    label: "Priority Scan",
    shortLabel: "PS",
  },
};

const capitalize = (data?: string) =>
  data ? data.charAt(0).toUpperCase() + data.slice(1) : "";

const getLatestScan = (data: ApiScheduler) =>
  data.scan && data.scan.length > 0 ? data.scan[0] : null;

const formatSchedulerData = (data: ApiScheduler) => {
  const date = new Date(data.startDate ?? Date.now());
  const formattedDate = date.toLocaleDateString();
  return `${data.scanName} | ${formattedDate} | ${capitalize(data.frequency)}`;
};

const SchedulerSelectionActionMenuGroupItem = ({
  data,
  onSelect,
  onClear,
}: {
  data: ApiScheduler;
  onSelect: (data: ApiScheduler) => void;
  onClear: () => void;
}) => {
  const selectedSchedulerId = useSelector(selectSelectedScheduler)?.id ?? "";
  const isSelected = selectedSchedulerId === data.id;

  // select specific scheduler
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
      <span>{formatSchedulerData(data)}</span>
    </button>
  );
};

const ScanSelectionActionMenuGroup = ({
  data,
  onSelect,
  onClear,
}: {
  data: ApiScheduler[];
  onSelect: (data: ApiScheduler) => void;
  onClear: () => void;
}) => {
  // get top 3 scans
  const filteredData = data
    // only if scheduler has scans
    .filter(getLatestScan)
    // sort by scan time desc
    .sort((a, b) => (a.startDate > b.startDate ? -1 : 1))
    // get top 5
    .slice(0, 5);

  const latestScan =
    filteredData.length > 0 ? getLatestScan(filteredData[0]) : null;

  const details = latestScan
    ? ScanTypeDetails[
        latestScan.scanType != null ? latestScan.scanType : DEFAULT_SCAN_TYPE
      ]
    : null;

  const selectedSchedulerId = useSelector(selectSelectedScheduler)?.id ?? "";

  const isGroupSelected =
    data.filter((d) => d.id === selectedSchedulerId).length > 0;

  // select top scheduler from group if not already selected or clear selection
  const handleClick = () => {
    if (isGroupSelected) {
      onClear();
    } else {
      onSelect(filteredData[0]);
    }
  };

  if (!details) return null;

  return (
    <div className={clsx("block w-full space-y-0.5")}>
      <button
        className={"block w-full p-2 text-black hover:bg-blue-200"}
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
          <div>
            <p>{`${details.label} (${details.shortLabel})`}</p>
          </div>
        </div>
      </button>
      <ul>
        {filteredData.map((data) => (
          <li key={data.id} className="pl-8 text-xs">
            <SchedulerSelectionActionMenuGroupItem
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

const SchedulerSelectionActionMenu = ({
  onSelectComplete,
}: {
  onSelectComplete: (data?: ApiScheduler) => void;
}) => {
  const [parent] = useAutoAnimate<HTMLUListElement>();

  const dispatch = useDispatch();

  const selectedAppId = useSelector(selectApplicationInfo)?.appId ?? "";

  const {
    data: schedulerData,
    isLoading,
    isError,
  } = useSchedulerData(selectedAppId);

  const handleSchedulerSelect = useCallback(
    (data: ApiScheduler) => {
      // select latest scan from scheduler
      const latestScan = getLatestScan(data);
      dispatch(
        onChangeSelectedScan({
          scan: latestScan,
        })
      );
      dispatch(
        onChangeSelectedScheduler({
          scheduler: data,
        })
      );
      onSelectComplete?.(data);
    },
    [onSelectComplete]
  );

  const handleClearSelection = useCallback(() => {
    dispatch(
      onChangeSelectedScan({
        scan: null,
      })
    );
    dispatch(
      onChangeSelectedScheduler({
        scheduler: null,
      })
    );
    onSelectComplete?.();
  }, [onSelectComplete]);

  const itemsGroupedByType = useMemo(
    () =>
      (schedulerData ?? []).reduce<Record<ScanType, ApiScheduler[]>>(
        (acc, data) => {
          const latestScan = getLatestScan(data);
          // skip this scheduler if it has no scans
          if (!latestScan) return acc;
          const scanType = latestScan.scanType ?? null;
          if (!acc[scanType]) {
            acc[scanType] = [];
          }
          acc[scanType].push(data);
          return acc;
        },
        {} as Record<ScanType, ApiScheduler[]>
      ),
    [schedulerData]
  );

  if (isLoading) return <Skeleton className="h-24 !w-full" />;

  if (isError) return <div>Error</div>;

  return (
    <div className="my-2 space-y-1 rounded-xl border bg-white pt-2 shadow-xl">
      <ul
        ref={parent}
        className="list-reset max-h-64 scroll-m-2 overflow-y-auto"
      >
        {
          // if no schedulers, show empty state
          Object.keys(itemsGroupedByType).length === 0 && (
            <li>
              <div className="p-4 text-center">
                <p className="text-sm text-gray-700">
                  No schedulers available for this app
                </p>
              </div>
            </li>
          )
        }
        {
          // render schedulers grouped by type
          Object.keys(itemsGroupedByType).map((key) => {
            const scanType = key as ScanType;
            const data = itemsGroupedByType[scanType];
            return (
              <li key={scanType}>
                <ScanSelectionActionMenuGroup
                  data={data}
                  onSelect={handleSchedulerSelect}
                  onClear={handleClearSelection}
                />
              </li>
            );
          })
        }
      </ul>
      <div className=" text-right">
        <HorizontalSeparator />
        <Link to="/scheduler">
          <div className="text-md px-2 py-2 underline">View All</div>
        </Link>
      </div>
    </div>
  );
};

export const SchedulerSelectionMenu = (
  _props: PropsWithChildren<AppSelectionBarProps>
) => {
  const [show, setShow] = useState(false);

  const selectedAppId = useSelector(selectApplicationInfo)?.appId ?? "";

  const selectedScheduler = useSelector(selectSelectedScheduler);
  const schedulersQuery = useSchedulerData(selectedAppId);

  const dispatch = useDispatch();

  const closeMenu = () => setShow(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, closeMenu);
  useKeydown("Escape", closeMenu);

  useEffect(() => {
    if (selectedScheduler) {
      // reset selected scheduler if it is not in the list
      if (schedulersQuery.data && schedulersQuery.data.length > 0) {
        const result =
          schedulersQuery.data?.find(
            (scheduler) => scheduler.id === selectedScheduler.id
          ) ?? null;

        if (!result) {
          dispatch(
            onChangeSelectedScan({
              scan: null,
            })
          );
          dispatch(
            onChangeSelectedScheduler({
              scheduler: null,
            })
          );
          return;
        }
      } else {
        dispatch(
          onChangeSelectedScan({
            scan: null,
          })
        );
        dispatch(
          onChangeSelectedScheduler({
            scheduler: null,
          })
        );
      }
    }

    if (selectedScheduler == null) {
      if (schedulersQuery.data && schedulersQuery.data.length > 0) {
        const latestScheduler = schedulersQuery.data.sort((a, b) =>
          a.startDate > b.startDate ? -1 : 1
        )[0];
        const latestScan = getLatestScan(latestScheduler);
        dispatch(
          onChangeSelectedScan({
            scan: latestScan,
          })
        );
        dispatch(
          onChangeSelectedScheduler({
            scheduler: latestScheduler,
          })
        );
      } else {
        dispatch(
          onChangeSelectedScan({
            scan: null,
          })
        );
        dispatch(
          onChangeSelectedScheduler({
            scheduler: null,
          })
        );
      }
    }
  }, [schedulersQuery.data, selectedScheduler]);

  const isLoading = schedulersQuery.isLoading;
  const isError = schedulersQuery.isError;

  return (
    <>
      <div className="relative space-y-2">
        <button
          className={clsx(
            "block fill-gray-700 hover:fill-gray-800",
            isLoading ? "cursor-not-allowed" : "cursor-pointer"
          )}
          aria-label="Toggle Scan Selection Dropdown"
          onClick={() => setShow(!show)}
        >
          <div className="flex items-center justify-between rounded-full bg-[#9483E5] py-2 px-4 text-lg">
            <div className="w-72 truncate text-left text-white">
              Scheduler:{" "}
              <strong className="font-display">
                {isLoading ? (
                  "Loading"
                ) : isError ? (
                  <div className="m-0 inline p-0 text-red-500">Error</div>
                ) : selectedScheduler != null ? (
                  selectedScheduler.scanName
                ) : (
                  "Select a Scheduler"
                )}
              </strong>
            </div>{" "}
            <div>
              {show ? (
                <CircleUp className="fill-white !stroke-[#9483E5]" />
              ) : (
                <CircleDown className="fill-white !stroke-[#9483E5]" />
              )}
            </div>
          </div>
        </button>
        {show && (
          <div
            ref={ref}
            className="min-h-24 min-w-32 absolute top-8 left-0 z-30"
          >
            <SchedulerSelectionActionMenu onSelectComplete={closeMenu} />
          </div>
        )}
      </div>
    </>
  );
};
