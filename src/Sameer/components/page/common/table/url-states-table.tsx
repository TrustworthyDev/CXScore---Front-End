import { ChangeEvent, MouseEvent, PropsWithChildren } from "react";
import { ValidateIcon } from "@/icons/Validate";
import { Row, Table as ReactTable, ColumnDef } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { ReplayIcon } from "@/icons/Replay";
import { SmallSpinner } from "../../../atoms/loading";
import { useReplay } from "../../../../lib/replay";
import { useModalReducer } from "../../../../lib/util/use-modal-reducer";
import { submitScanRequest } from "@/api";
import { useDispatch, useSelector } from "react-redux";
import {
  selectApplicationInfo,
  selectSelectedScan,
} from "@/reduxStore/app/app.reducer";
import { ScanSubType, ScanType } from "@/types/enum";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ScanIcon } from "@/icons/ScanIcon";
import { Confirmation, ConfirmationButtonConfig } from "@/atoms/Confirmation";
import { gotoValidate } from "@/utils/navigateUtils";
import {
  ViolationsActions,
  ViolationsSelectors,
} from "@/reduxStore/violations/violations";
import { StateSummaryFlat } from "~/Sameer/lib/violations/state-summary";
import { WarningIcon } from "@/icons/Warning";
import {
  ActionIcon,
  Checkbox,
  Divider,
  Flex,
  Group,
  Popover,
  Text,
} from "@mantine/core";
import { Table } from "@/atoms/Table/MantineTable";

type Model = StateSummaryFlat["states"][number];

export const URLStatesTable = (props: {
  data: Model[];
  isLoading?: boolean;
}) => {
  const columns: ColumnDef<Model>[] = useMemo(
    () => [
      {
        id: "stateSelection",
        cell: ({ row }) => <StateSelectionRowCheckbox row={row} />,
        header: ({ table }) => <StateSelectionHeaderCheckbox table={table} />,
        footer: "",
      },
      {
        id: "stateId",
        accessorFn: (row) => row.stateId,
        cell: ({ row }) => <Text>{row.original.stateId}</Text>,
        header: "State ID",
        footer: "State ID",
      },
      {
        id: "violationsCount",
        accessorFn: (row) => row.violationsCount,
        cell: ({ row }) => (
          <>
            <Text>{row.original.violationsCount}</Text>
            {row.original.error &&
              row.original.error.errors &&
              row.original.error.errors.length > 0 && (
                <StateErrorTooltip error={row.original.error}>
                  <ActionIcon
                    aria-label="Errors Found. Open Details"
                    className="ml-2"
                  >
                    <WarningIcon />
                  </ActionIcon>
                </StateErrorTooltip>
              )}
          </>
        ),
        sortingFn: "alphanumeric",
        header: "Violations",
        footer: "Violations",
      },
      {
        id: "eventSequence",
        accessorFn: (row) => row.eventSequence,
        cell: (row) => (
          <Text ta="left" size="sm">
            {row.getValue<string>()}
          </Text>
        ),
        header: "Event Sequence",
        footer: "Event Sequence",
      },
      // {
      //   id: "error",
      //   accessorFn: (row) => row.error,
      //   cell: ({ row }) => <StateRowError row={row} />,
      //   header: "Status",
      //   footer: "Status",
      // },
      {
        id: "actions",
        cell: ({ row }) => <Actions url={row.original.url} row={row} />,
        header: "Devtools",
        footer: "Devtools",
      },
    ],
    []
  );

  if (props.isLoading) {
    return (
      <div className="flex items-center gap-2 px-6">
        <SmallSpinner className="!mr-0 !ml-0 !h-6 !w-6" />
        <h1>Loading states...</h1>
      </div>
    );
  }

  if (props.data.length === 0) {
    return (
      <div className="flex items-center gap-2 px-6">
        <h1>No states found for this URL</h1>
      </div>
    );
  }
  return (
    <Table
      data={props.data}
      withBorder={false}
      withColumnVisibility={false}
      columns={columns}
    />
  );
};

const buttonList: ConfirmationButtonConfig[] = [
  { buttonId: "yes", buttonText: "Scan Now", buttonStyle: "success" },
  { buttonId: "no", buttonText: "Cancel", buttonStyle: "warning" },
];

const Actions = ({ url, row }: { url: string; row: Row<Model> }) => {
  const navigate = useNavigate();
  const { modalDispatch, modalProps } = useModalReducer();

  const queryClient = useQueryClient();
  const { replay, isLoading: isReplayLoading } = useReplay();

  const selectedApplication = useSelector(selectApplicationInfo) ?? null;
  const selectedApplicationId = selectedApplication?.appId ?? "";
  const selectedScanId = useSelector(selectSelectedScan)?.id || "";

  const handleReplayClick = () => {
    replay(row.original.eventSequence);
  };

  const handleValidateClick = (e: MouseEvent<HTMLButtonElement>) => {
    gotoValidate({
      navigate,
      appId: selectedApplicationId,
      scanId: selectedScanId,
      stateId: row.original.stateId,
      element: "",
      url: "",
      violationId: "",
      ruleId: "",
      ctrlKey: e.ctrlKey || e.metaKey,
      isAutomated: true,
    });
  };

  const handleConfirm = useCallback(() => {
    const scanConfig = {
      url,
      scanOnlyStateId: row.original.stateId,
      appId: {
        id: selectedApplicationId,
      },
      scanType: ScanType.SinglePageScan,
      scanSubType: ScanSubType.DeepScan,
    };
    return submitScanRequest(scanConfig)
      .then(() => {
        queryClient.invalidateQueries(["ScansData"]);
      })
      .then(() => {
        navigate("/scans");
      })
      .catch(() => {
        alert("Something went wrong");
      });
  }, [navigate, queryClient, row.original.stateId, selectedApplicationId, url]);

  const handleRescanClick = useCallback(() => {
    modalDispatch({
      type: "updateModalProps",
      payload: {
        showModal: true,
        content: "Confirm Single Page Scan for State: " + row.original.stateId,
        onClickButton: async (id: string) => {
          if (id === "yes") {
            await handleConfirm().then(() => {
              modalDispatch({
                type: "hideModal",
              });
            });
          } else {
            modalDispatch({
              type: "hideModal",
            });
          }
        },
      },
    });
  }, [handleConfirm, modalDispatch, row.original.stateId]);

  return (
    <Group align="center" justify="center" wrap="nowrap" gap="xs">
      <ActionIcon
        aria-label="Replay"
        onClick={handleReplayClick}
        disabled={isReplayLoading}
      >
        <ReplayIcon fill="black" className="h-6 w-6" />
      </ActionIcon>
      <Divider orientation="vertical" />
      <ActionIcon aria-label="Re-scan" onClick={handleRescanClick}>
        <ScanIcon fill="black" />
      </ActionIcon>
      <Confirmation
        title={"Re-scan for " + url}
        content={modalProps.content}
        isOpen={modalProps.showModal}
        onRequestClose={() =>
          modalDispatch({
            type: "hideModal",
          })
        }
        buttonList={buttonList}
        onClickButton={modalProps.onClickButton}
      />
      <Divider orientation="vertical" />
      <ActionIcon aria-label="Validate" onClick={handleValidateClick}>
        <ValidateIcon className="h-6 w-6" />
      </ActionIcon>
    </Group>
  );
};

const StateSelectionRowCheckbox = ({ row }: { row: Row<Model> }) => {
  const selectedStateIds = useSelector(
    ViolationsSelectors.selectSelectedStateIds
  );

  const dispatch = useDispatch();

  const handleStateSelection = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.currentTarget.checked) {
        dispatch(
          ViolationsActions.SET_VIOLATION_STATE_IDS.action({
            selectedStateIds: [
              ...new Set([...selectedStateIds, row.original.stateId]),
            ],
          })
        );
      } else {
        dispatch(
          ViolationsActions.SET_VIOLATION_STATE_IDS.action({
            selectedStateIds: selectedStateIds.filter(
              (id) => id !== row.original.stateId
            ),
          })
        );
      }
    },
    [dispatch, row.original.stateId, selectedStateIds]
  );

  return (
    <Flex
      align="center"
      gap="xs"
      justify="center"
      style={{ whiteSpace: "nowrap" }}
    >
      <Checkbox
        aria-label="Select & deselect state"
        checked={selectedStateIds.includes(row.original.stateId)}
        onChange={handleStateSelection}
      />
    </Flex>
  );
};

const StateSelectionHeaderCheckbox = ({
  table,
}: {
  table: ReactTable<Model>;
}) => {
  const selectedStateIds = useSelector(
    ViolationsSelectors.selectSelectedStateIds
  );

  const allStateIdsHere = table
    .getPrePaginationRowModel()
    .rows.map((row) => row.original.stateId);

  const allChecked = allStateIdsHere.every((id) =>
    selectedStateIds.includes(id)
  );
  const indeterminate =
    !allChecked && selectedStateIds.some((id) => allStateIdsHere.includes(id));

  const dispatch = useDispatch();

  const handleStateSelection = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.currentTarget.checked) {
        dispatch(
          ViolationsActions.SET_VIOLATION_STATE_IDS.action({
            selectedStateIds: [
              ...new Set([...selectedStateIds, ...allStateIdsHere]),
            ],
          })
        );
      } else {
        dispatch(
          ViolationsActions.SET_VIOLATION_STATE_IDS.action({
            selectedStateIds: [
              ...new Set(
                selectedStateIds.filter((id) => !allStateIdsHere.includes(id))
              ),
            ],
          })
        );
      }
    },
    [allStateIdsHere, dispatch, selectedStateIds]
  );

  return (
    <Flex
      align="center"
      gap="xs"
      justify="center"
      style={{ whiteSpace: "nowrap" }}
    >
      <Checkbox
        checked={allChecked}
        indeterminate={indeterminate}
        onChange={handleStateSelection}
        aria-label={allChecked ? "Unselect all states" : "Select all states"}
      />
    </Flex>
  );
};

const StateRowError = ({ row }: { row: Row<Model> }) => {
  // render errors if clicked
  return (
    <>
      {row.original.error &&
      row.original.error.errors &&
      row.original.error.errors.length > 0 ? (
        <StateErrorTooltip error={row.original.error}>
          <button
            aria-label="Errors Found. Open Details"
            className="ml-2 cursor-pointer whitespace-nowrap bg-transparent font-semibold  hover:underline"
          >
            View Error Details
          </button>
        </StateErrorTooltip>
      ) : (
        <div className="whitespace-nowrap">No Errors</div>
      )}
    </>
  );
};

export const StateErrorTooltip = ({
  error,
  children,
}: PropsWithChildren<{ error: StateError }>) => {
  return (
    <Popover width={320} withArrow shadow="md">
      <Popover.Target>{children}</Popover.Target>
      <Popover.Dropdown>
        <div className="text-left">
          This state has errors:
          {error.errors.map((err: string, index: number) => (
            <div key={index}>{err}</div>
          ))}
        </div>
      </Popover.Dropdown>
    </Popover>
  );
};

