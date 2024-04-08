import {
  useCallback,
  useState,
  MouseEvent,
  useMemo,
  Dispatch,
  useRef,
  useEffect,
  PropsWithChildren,
} from "react";
import {
  CellContext,
  Row,
  Table as ReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import { SnapshotIcon } from "@/icons/Snapshot";
import { ValidateIcon } from "@/icons/Validate";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "../../atoms/loading/skeleton";
import { ScanIcon } from "@/icons/ScanIcon";
import { useDispatch, useSelector } from "react-redux";
import {
  selectApplicationInfo,
  selectSelectedScan,
} from "@/reduxStore/app/app.reducer";
import { submitScanRequest } from "@/api";
import { ScanSubType, ScanType } from "@/types/enum";
import { Confirmation } from "@/atoms/Confirmation";
import {
  UseModalReducerAction,
  useModalReducer,
} from "../../../lib/util/use-modal-reducer";
import { useViolationsCheckedFilters } from "../../../lib/violations/count";
import { URLStatesTable } from "../common/table/url-states-table";
import { useQueryClient } from "@tanstack/react-query";
import { getValidateUrl, gotoValidate } from "@/utils/navigateUtils";
import { ExternalLink } from "../../atoms/external-link/external-link";
import {
  StateSummaryFlat,
  useSelectedAppViolationsStateSummary,
} from "../../../lib/violations/state-summary";
import {
  ViolationsActions,
  ViolationsSelectors,
} from "@/reduxStore/violations/violations";
import { TableExpandCell, TableExpandHeader } from "../common/table/expansion";
import {
  ActionIcon,
  Checkbox,
  Divider,
  Flex,
  Group,
  Popover,
} from "@mantine/core";
import { getHttpStatusCodeString } from "~/Suraj/utils/utils";
import { WarningIcon } from "@/icons/Warning";
import { Table, TableExpandProps, TableRef } from "@/atoms/Table/MantineTable";

export const ViolationsUrlTable = () => {
  const tableRef = useRef<TableRef>(null);

  const { modalProps, modalDispatch } = useModalReducer();

  const [search, setSearch] = useState("");

  const queryResult = useSelectedAppViolationsStateSummary({
    clientTextSearch: search,
  });

  const columns: ColumnDef<StateSummaryFlat>[] = useMemo(
    () => [
      {
        id: "expand",
        footer: "Expand",
        header: ({ table }) => <TableExpandHeader table={table} />,
        cell: ({ row }) => <TableExpandCell row={row} />,
      },
      {
        id: "select",
        header: ({ table }) => <UrlHeaderCheckbox table={table} />,
        cell: ({ row }) => <UrlRowCheckbox row={row} />,
      },
      {
        id: "url",
        accessor: "url",
        cell: (row) => (
          <ExternalLink
            href={row.row.original.url}
            label={row.row.original.url}
          />
        ),
        sortingFn: "alphanumeric",
        header: "URL",
        footer: "URL",
      },
      {
        id: "states",
        accessorFn: (row) => row.totalStates,
        cell: (row) => <span>{row.getValue<number>()}</span>,
        sortingFn: "alphanumeric",
        header: "States",
        footer: "States",
      },
      {
        id: "count",
        accessorFn: (row) => row.totalViolations,
        cell: (row) => <UrlRowViolationCount row={row.row} />,
        sortingFn: "alphanumeric",
        header: "Violations",
        footer: "Violations",
      },
      // {
      //   id: "error",
      //   accessorFn: (row) => row.error,
      //   cell: (row) => <UrlRowError row={row.row} />,
      //   header: "Status",
      //   footer: "Status",
      // },
      {
        id: "actions",
        cell: (row) => <Actions row={row} modalDispatch={modalDispatch} />,
        header: "Devtools",
        footer: "Devtools",
      },
    ],
    [modalDispatch]
  );

  // reset pagination on filter change
  const checkedFilters = useViolationsCheckedFilters();
  const prevCheckedFilters = useRef(checkedFilters);

  useEffect(() => {
    if (
      JSON.stringify(prevCheckedFilters.current) !==
      JSON.stringify(checkedFilters)
    ) {
      tableRef.current?.init();
      prevCheckedFilters.current = checkedFilters;
    }
  }, [checkedFilters]);

  const handleChangeSearch = useCallback(
    () => (value: string) => {
      setSearch(value);
    },
    []
  );

  const dispatch = useDispatch();
  const selectedStateIds = useSelector(
    ViolationsSelectors.selectSelectedStateIds
  );

  useEffect(() => {
    // all state ids
    const allStates = queryResult.data?.reduce(
      (acc, url) => [...acc, ...url.states.map((state) => state.stateId)],
      [] as string[]
    );

    // check if all selected state ids are in all state ids
    const allSelectedStatesInAllStates = selectedStateIds.every((stateId) =>
      allStates?.includes(stateId)
    );

    // if not remove all selected state ids
    if (!allSelectedStatesInAllStates) {
      dispatch(
        ViolationsActions.SET_VIOLATION_STATE_IDS.action({
          selectedStateIds: [],
        })
      );
    }
  }, [dispatch, queryResult.data, selectedStateIds]);

  const ViolationFilterExpandElement = useCallback(
    ({ data }: TableExpandProps<StateSummaryFlat>) => (
      <URLStatesTable data={data.states} />
    ),
    []
  );

  if (queryResult.isLoading) {
    return <ViolationsUrlTableSkeleton />;
  }

  if (queryResult.isError) {
    return <div className="text-red-500">Error</div>;
  }

  return (
    <>
      <Table
        data={queryResult.data}
        columns={columns}
        withBorder={false}
        withColumnVisibility={false}
        onSearchChange={handleChangeSearch}
        ExpandElement={ViolationFilterExpandElement}
      />
      <Confirmation
        title="Re-scan"
        content={modalProps.content}
        isOpen={modalProps.showModal}
        onRequestClose={() =>
          modalDispatch({
            type: "hideModal",
          })
        }
        buttonList={[
          { buttonId: "yes", buttonText: "Scan Now", buttonStyle: "success" },
          { buttonId: "no", buttonText: "Cancel", buttonStyle: "warning" },
        ]}
        onClickButton={modalProps.onClickButton}
      />
    </>
  );
};

type Model = StateSummaryFlat;

const UrlRowCheckbox = ({ row }: { row: Row<StateSummaryFlat> }) => {
  const urlStateIdList = row.original.states.map((state) => state.stateId);

  const selectedStates = useSelector(
    ViolationsSelectors.selectSelectedStateIds
  );

  const dispatch = useDispatch();

  const allChecked = urlStateIdList.every((stateId) =>
    selectedStates.includes(stateId)
  );
  const someChecked = urlStateIdList.some((stateId) =>
    selectedStates.includes(stateId)
  );

  const handleOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // if checked add
      if (e.currentTarget.checked) {
        dispatch(
          ViolationsActions.SET_VIOLATION_STATE_IDS.action({
            selectedStateIds: [
              ...new Set([...selectedStates, ...urlStateIdList]).values(),
            ],
          })
        );
      } else {
        // if unchecked remove
        dispatch(
          ViolationsActions.SET_VIOLATION_STATE_IDS.action({
            selectedStateIds: selectedStates.filter(
              (stateId) => !urlStateIdList.includes(stateId)
            ),
          })
        );
      }
    },
    [dispatch, selectedStates, urlStateIdList]
  );

  return (
    <Flex
      align="center"
      gap="xs"
      justify="center"
      style={{ whiteSpace: "nowrap" }}
    >
      <Checkbox
        aria-label={"Select this row"}
        checked={allChecked}
        indeterminate={someChecked}
        onChange={handleOnChange}
      />
    </Flex>
  );
};

const UrlRowError = ({ row }: { row: Row<Model> }) => {
  // render errors if clicked
  return (
    <>
      {row.original.error ? (
        <UrlErrorTooltip error={row.original.error}>
          <button
            aria-label="Errors Found. Open Details"
            className="ml-2 cursor-pointer whitespace-nowrap bg-transparent font-semibold  hover:underline"
          >
            View Error Details
          </button>
        </UrlErrorTooltip>
      ) : (
        <div className="whitespace-nowrap">No Errors</div>
      )}
    </>
  );
};

const UrlRowViolationCount = ({ row }: { row: Row<StateSummaryFlat> }) => {
  return (
    <div className="flex items-center justify-center">
      <div>{row.original.totalViolations}</div>
      {row.original.error && (
        <UrlErrorTooltip error={row.original.error}>
          <ActionIcon aria-label="Errors Found. Open Details" className="ml-2">
            <WarningIcon />
          </ActionIcon>
        </UrlErrorTooltip>
      )}
    </div>
  );
};

export const UrlErrorTooltip = ({
  error,
  children,
}: PropsWithChildren<{ error: UrlError }>) => {
  return (
    <Popover width={320} withArrow shadow="md">
      <Popover.Target>{children}</Popover.Target>
      <Popover.Dropdown>
        <div className="text-left">
          This URL has errors:
          <div className="">
            Status Code - {error.statusCode} (
            {getHttpStatusCodeString(error.statusCode ?? 0)})
          </div>
          <div className="">Error - {error.error}</div>
        </div>
      </Popover.Dropdown>
    </Popover>
  );
};

const UrlHeaderCheckbox = ({ table }: { table: ReactTable<Model> }) => {
  const selectedStates =
    useSelector(ViolationsSelectors.selectSelectedStateIds) ?? [];

  const dispatch = useDispatch();

  const allStates = table
    .getPrePaginationRowModel()
    .rows.flatMap((row) => row.original.states.map((state) => state.stateId));

  const allChecked = allStates.every((stateId) =>
    selectedStates.includes(stateId)
  );

  const someChecked = allStates.some((stateId) =>
    selectedStates.includes(stateId)
  );

  const handleOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // if checked add
      if (e.currentTarget.checked) {
        dispatch(
          ViolationsActions.SET_VIOLATION_STATE_IDS.action({
            selectedStateIds: [...new Set([...allStates]).values()],
          })
        );
      } else {
        // if unchecked reset
        dispatch(
          ViolationsActions.SET_VIOLATION_STATE_IDS.action({
            selectedStateIds: [],
          })
        );
      }
    },
    [dispatch, allStates]
  );

  return (
    <Flex align="center" gap="xs" style={{ whiteSpace: "nowrap" }}>
      <Checkbox
        aria-label={
          table.getIsAllRowsSelected() ? "Unselect All rows" : "Select all rows"
        }
        checked={allChecked}
        indeterminate={someChecked}
        onChange={handleOnChange}
      />
    </Flex>
  );
};

const Actions = ({
  row,
  modalDispatch,
}: {
  row: CellContext<Model, unknown>;
  modalDispatch: Dispatch<UseModalReducerAction>;
}) => {
  const navigate = useNavigate();
  const selectedApplicationId = useSelector(selectApplicationInfo)?.appId ?? "";
  const selectedApplicationName =
    useSelector(selectApplicationInfo)?.appName ?? "";
  const selectedScanId = useSelector(selectSelectedScan)?.id || "";

  const handleSnapshotClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      gotoValidate({
        navigate,
        appId: selectedApplicationId,
        scanId: selectedScanId,
        stateId: "",
        element: "",
        url: row.row.original?.url,
        violationId: "",
        ruleId: "",
        ctrlKey: e.ctrlKey || e.metaKey,
        isAutomated: true,
      });
    },
    [navigate, row.row.original?.url, selectedApplicationId, selectedScanId]
  );

  const queryClient = useQueryClient();

  const handleRescanClick = useCallback(() => {
    modalDispatch({
      type: "updateModalProps",
      payload: {
        showModal: true,
        content: "Confirm Single Page Scan for URL: " + row.row.original.url,
        onClickButton: (id: string) => {
          if (id === "yes") {
            submitScanRequest({
              appId: {
                id: selectedApplicationId,
                name: selectedApplicationName,
              },
              scanUrlList: [row.row.original.url],
              scanType: ScanType.SinglePageScan,
              scanSubType: ScanSubType.RapidScan,
              browserWindow: false,
            })
              .then(() => {
                queryClient.invalidateQueries(["ScansData"]);
              })
              .then(() => {
                navigate("/scans");
              })
              .catch(() => {
                alert("Something went wrong");
              });
          }
          modalDispatch({ type: "hideModal" });
        },
      },
    });
  }, [
    modalDispatch,
    navigate,
    queryClient,
    row.row.original.url,
    selectedApplicationId,
    selectedApplicationName,
  ]);

  const validateUrl = getValidateUrl({
    appId: selectedApplicationId,
    scanId: selectedScanId,
    stateId: "",
    element: "",
    url: row.row.original?.url,
    violationId: "",
    ruleId: "",
    isAutomated: true,
  });

  return (
    <Group align="center" justify="center" wrap="nowrap" gap="xs">
      <ActionIcon aria-label="Show snapshot" onClick={handleSnapshotClick}>
        <SnapshotIcon className="h-6 w-6" />
      </ActionIcon>
      <Divider orientation="vertical" />
      <ActionIcon aria-label="Re-scan" onClick={handleRescanClick}>
        <ScanIcon fill="black" />
      </ActionIcon>
      <Divider orientation="vertical" />
      <Link to={validateUrl} title="Validate">
        <ValidateIcon className="h-6 w-6" />
      </Link>
    </Group>
  );
};

export const ViolationsUrlTableSkeleton = () => {
  return (
    <div className="w-full space-y-2">
      {[...Array(5)].map((_, index) => (
        <Skeleton key={index} className="!h-4 !w-full" />
      ))}
    </div>
  );
};

