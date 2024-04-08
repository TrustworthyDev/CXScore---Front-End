import {
  ActionIcon,
  Button,
  Divider,
  Group,
  Menu,
  Switch,
  Text,
} from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import {
  ColumnDef,
  PaginationState,
  Table as ReactTable,
  Row,
  SortingState,
} from "@tanstack/react-table";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { submitScanRequest } from "@/api";
import { Confirmation } from "@/atoms/Confirmation";
import {
  Table,
  TableActionProps,
  TableExpandProps,
  TableFooterProps,
  TableRef,
} from "@/atoms/Table/MantineTable";
import { Close } from "@/icons/Close";
import { CreateTicketIcon } from "@/icons/CreateTicket";
import { Exclamation } from "@/icons/Exclamation";
import { Pass } from "@/icons/Pass";
import { ReplayIcon } from "@/icons/Replay";
import { ScanIcon } from "@/icons/ScanIcon";
import { ValidateIcon } from "@/icons/Validate";
import { selectApplicationInfo } from "@/reduxStore/app/app.reducer";
import {
  ManualTestResult as ManualTestResultEnum,
  ScanType,
} from "@/types/enum";
import { getValidateUrl } from "@/utils/navigateUtils";
import { exportTableAsPdfWithHtml } from "@/utils/tableUtils";
import images from "~/assets";

import { useSelectedAppId } from "../../../lib/application/use-application-data";
import { useGuidedCheckedFilters } from "../../../lib/guided/count";
import { useGuidedDoDeduplicate } from "../../../lib/guided/dedupe";
import { useGuided } from "../../../lib/guided/query";
import {
  useCreateNewTicket,
  usePostViolation,
  useSubmitScanRequest,
} from "../../../lib/mutations";
import { useReplay } from "../../../lib/replay";
import {
  ViolationFieldNamesForExport,
  generateIssueDescription,
  getApiViolationFields,
} from "../../../lib/util/table-utils";
import { useLocalStorageState } from "../../../lib/util/use-local-storage-state";
import {
  UseModalReducerAction,
  useModalReducer,
} from "../../../lib/util/use-modal-reducer";
import { ExternalLink } from "../../atoms/external-link/external-link";
import { SmallSpinner } from "../../atoms/loading";
import { Skeleton } from "../../atoms/loading/skeleton";
import { TableExpandCell, TableExpandHeader } from "../common/table/expansion";
import {
  ExportToCSVButton,
  StartExportToCSVGuidedButton,
} from "../common/table/export-to-csv";
import {
  TableSelectionCell,
  TableSelectionHeader,
} from "../common/table/selection";
import { TicketLink } from "../common/ticket-link/ticket-link";
import { ViolationDetail } from "../violations/violation-filter-table-sub-component";

export const GuidedFilterTableSkeleton = () => {
  return (
    <div className="w-full space-y-2">
      {[...Array(5)].map((_, index) => (
        <Skeleton key={index} className="!h-4 !w-full" />
      ))}
    </div>
  );
};

export const GuidedFilterTable = () => {
  return <GuidedTable />;
};

type Model = ApiViolation;

export function GuidedTable(): JSX.Element {
  const tableRef = useRef<TableRef>(null);
  const { modalProps, modalDispatch } = useModalReducer();

  const [pagination, setPagination] = useLocalStorageState<PaginationState>(
    "guided/pagination",
    {
      pageIndex: 0,
      pageSize: 10,
    },
  );
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useLocalStorageState<SortingState>(
    "guided/sorting",
    [],
  );

  const { data, isLoading, isError, isFetching, isRefetching } = useGuided({
    outputOpts: {
      pagination,
      textSearch: search,
      sort: sorting,
    },
  });

  const columns: ColumnDef<Model>[] = useMemo(
    () => [
      {
        id: "expand",
        footer: "Expand",
        header: ({ table }) => <TableExpandHeader table={table} />,
        cell: ({ row }) => <TableExpandCell row={row} />,
      },
      {
        id: "select",
        footer: "Select",
        header: ({ table }) => <TableSelectionHeader table={table} />,
        cell: ({ row }) => <TableSelectionCell row={row} />,
      },
      {
        id: "id",
        footer: "Violation ID",
        accessorFn: (row) => row.id,
        header: "Violation ID",
        cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
      },
      {
        id: "url",
        footer: "URL",
        accessorFn: (row) => row.url,
        header: "URL",
        cell: ({ getValue }) => (
          <ExternalLink
            href={getValue<string>()}
            label={getValue<string>()}
            labelMaxCharacters={40}
          />
        ),
      },
      {
        id: "manualTestResult",
        footer: "Test Status",
        header: "Test Status",
        cell: ({ row }) => (
          <ManualTestResult value={row.original.manualTestResult} />
        ),
      },
      {
        id: "rule.detailSuccessCriteria",
        footer: "Success Criteria",
        accessorFn: (row) => row.rule?.detailSuccessCriteria,
        cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
        header: "Success Criteria",
      },
      {
        id: "rule.successCriteriaDescription",
        footer: "Success Criteria Description",
        accessorFn: (row) => row.rule?.successCriteriaDescription,
        cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
        header: "Success Criteria Description",
      },
      {
        id: "rule.disability",
        footer: "Disability",
        accessorFn: (row) => row?.rule?.disability,
        cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
        header: "Disability",
      },
      {
        id: "rule.detailPrinciples",
        footer: "Principles",
        accessorFn: (row) => row.rule?.detailPrinciples,
        cell: ({ getValue }) => (
          <Text size="sm" tt="capitalize">
            {getValue<string>()}
          </Text>
        ),
        header: "Principles",
      },
      {
        id: "rule.detailWcag2021",
        footer: "WCAG",
        accessorFn: (row) => row.rule?.detailWcag2021,
        cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
        header: "WCAG",
      },
      {
        id: "rule.detailLevel",
        footer: "Conformance",
        accessorFn: (row) => row.rule?.detailLevel,
        cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
        header: "Conformance",
      },
      {
        id: "rule.name",
        footer: "Rule ID",
        accessorFn: (row) => row.rule?.name,
        header: "Rule ID",
        cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
      },
      {
        id: "rule.description",
        footer: "Issue Description",
        header: "Issue Description",
        cell: ({ row }) => (
          <Text size="sm">
            {generateIssueDescription(
              row.original.rule?.description ?? "",
              row.original.explanation,
            )}
          </Text>
        ),
      },
      {
        id: "rule.issueCategory",
        footer: "Issue Category",
        accessorFn: (row) => row.rule?.issueCategory,
        cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
        header: "Issue Category",
      },
      {
        id: "rule.issueClassification",
        footer: "Issue Type",
        accessorFn: (row) => row.rule?.issueClassification,
        cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
        header: "Issue Type",
      },
      {
        id: "rule.issueName",
        footer: "Issue Name",
        accessorFn: (row) => row.rule?.issueName,
        cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
        header: "Issue Name",
      },
      {
        id: "severity",
        footer: "Severity",
        accessorFn: (row) => row.severity,
        cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
        header: "Severity",
      },
      {
        id: "rule.type",
        footer: "Test Type",
        accessorFn: (row) => row.rule?.type,
        header: "Test Type",
        cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
      },
      {
        id: "remediationSummary",
        footer: "Remediation Summary",
        accessorFn: (row) => row.remediationSummary,
        header: "Remediation Summary",
        cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
      },
      {
        id: "rule.help",
        footer: "Help",
        accessorFn: (row) => row.rule?.help,
        cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
        header: "Help",
      },
      {
        id: "rule.helpUrl",
        footer: "Help URL",
        accessorFn: (row) => row.rule?.helpUrl,
        cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
        header: "Help URL",
      },
      {
        id: "cssSelector",
        footer: "CSS Selector",
        accessorFn: (row) => row.cssSelector,
        header: "CSS Selector",
        cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
      },
      {
        id: "html",
        footer: "HTML Source",
        accessorFn: (row) => row.html,
        header: "HTML Source",
        cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
      },
      {
        id: "rule.element",
        footer: "Element",
        accessorFn: (row) => row.rule?.element,
        cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
        header: "Element",
      },
      {
        id: "rule.detailSec508",
        footer: "Sec 508",
        accessorFn: (row) => row.rule?.detailSec508,
        cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
        header: "Sec 508",
      },
      {
        id: "actRuleId",
        footer: "ACT Rule ID",
        accessorFn: (row) => row.rule?.actRuleId,
        cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
        header: "ACT Rule ID",
      },
      {
        id: "actRuleDescription",
        footer: "ACT Rule Description",
        accessorFn: (row) => row.rule?.actRuleDescription,
        cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
        header: "ACT Rule Description",
      },
      {
        id: "ticketStatus",
        footer: "Ticket Status",
        cell: ({ row }) => (
          <TicketLink
            ticketStatus={row.original.ticketStatus}
            ticketId={row.original.ticketId}
          />
        ),
        header: "Ticket Status",
      },
      {
        id: "dupCount",
        footer: "Duplicate Count",
        accessorFn: (row) => row?.dupCount ?? 0,
        cell: ({ getValue }) => (
          <Text size="sm" tt="capitalize">
            {getValue<number>()}
          </Text>
        ),
        header: "Duplicate Count",
      },
      {
        id: "scanId",
        header: "Scan ID",
        footer: "Scan ID",
        accessorFn: (row) =>
          // check if row.scanId is an array and get the last element
          row?.scanId?.length ? row.scanId[row.scanId.length - 1] : row.scanId,
      },
      {
        id: "stateId",
        header: "State ID",
        footer: "State ID",
        accessorFn: (row) => row?.stateId,
      },
      {
        id: "notes",
        header: "Notes",
        footer: "Notes",
        cell: ({ row }) => {
          return (
            <div>
              {isFetching ? (
                <SmallSpinner />
              ) : (
                <Text size="sm">{row.original.notes}</Text>
              )}
            </div>
          );
        },
      },
      {
        id: "actions",
        footer: "Devtools",
        header: "Devtools",
        cell: ({ row }) => (
          <TableRowActions row={row} modalDispatch={modalDispatch} />
        ),
      },
    ],
    [isFetching, modalDispatch],
  );

  const initialColumnVisibility = {
    // the other columns
    ...columns.reduce(
      (acc, col) => ({ ...acc, [col.id as string]: false }),
      {},
    ),
    expand: true,
    select: true,
    url: true,
    manualTestResult: true,
    "rule.detailSuccessCriteria": true,
    // "rule.successCriteriaDescription": true,
    "rule.name": true,
    // "rule.disability": true,
    // "rule.detailWcag2021": true,
    "rule.detailLevel": true,
    "rule.issueCategory": true,
    severity: true,
    // "rule.type": true,
    // ticketStatus: true,
    dupCount: true,
    snapshotUrl: false,
    actions: true,
  };

  // reset pagination on filter change
  const checkedFilters = useGuidedCheckedFilters();
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

  // SEARCH
  const handleChangeSearch = useCallback((val: string) => {
    setSearch(val);
  }, []);

  // all data for export
  const {
    data: allData,
    isLoading: isAllDataLoading,
    isError: isAllDataError,
  } = useGuided({
    outputOpts: {
      getAllViolations: true,
      fields: ViolationFieldNamesForExport,
    },
  });

  const GuidedDetailExpandElement = useCallback(
    ({ data }: TableExpandProps<ApiViolation>) => (
      <ViolationDetail violation={data} showDuplicateTable={"guided"} />
    ),
    [],
  );

  const GuidedFooterElement = useCallback(
    ({ table }: TableFooterProps<ApiViolation>) => (
      <GuidedTableFooterElement
        table={table}
        isDataLoading={isAllDataLoading}
        allViolations={allData?.result}
        isDataError={isAllDataError}
      />
    ),
    [allData?.result, isAllDataError, isAllDataLoading],
  );

  if (isLoading) {
    return <GuidedFilterTableSkeleton />;
  }

  if (isError) {
    return <div className="text-red">Error</div>;
  }

  return (
    <>
      <Table
        isRefetching={isRefetching}
        ref={tableRef}
        data={data?.result}
        initialColumnVisibility={initialColumnVisibility}
        columns={columns}
        onSearchChange={handleChangeSearch}
        ActionsElement={GuidedTableActions}
        ExpandElement={GuidedDetailExpandElement}
        FooterElement={GuidedFooterElement}
        tableName="guided"
        manualPaginationProps={{
          pageCount: Math.ceil(
            (data?.totalCount ?? 0) / (pagination?.pageSize ?? 10),
          ),
          setPagination,
          pagination,
        }}
        manualSortProps={{
          sorting,
          setSorting,
        }}
        overrideTotalRowsForPagination={data?.totalCount ?? 0}
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
}

const GuidedTableActions: React.FC<TableActionProps<ApiViolation>> = ({
  table,
}) => {
  const applicationId = useSelectedAppId() ?? "";

  const selectedRows = table.getSelectedRowModel().rows;
  const selectedViolationIdList = selectedRows.map((row) => row.original.id);

  const [doDeduplicate, setDoDeduplicate] = useGuidedDoDeduplicate();

  const onDeduplicateChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setDoDeduplicate(e.target.checked);

  const createNewTicketMutation = useCreateNewTicket(() =>
    toast(
      "JIRA created successfully for Violation" +
        (selectedViolationIdList.length >= 2 ? "s" : ""),
    ),
  );

  const createNewTicketEnabled = !createNewTicketMutation.isLoading;

  const handleCreateNewTicket = () => {
    if (createNewTicketEnabled) {
      createNewTicketMutation.mutate({
        violationIds: selectedViolationIdList,
      });
    }
  };

  const postViolationMutation = usePostViolation(() =>
    toast(
      `Element${
        selectedViolationIdList.length >= 2 ? "s" : ""
      } marked as Violation`,
    ),
  );

  const markAsViolation = !postViolationMutation.isLoading;

  const handleMarkAsViolation = () => {
    if (markAsViolation) {
      postViolationMutation.mutate({
        violationIds: selectedViolationIdList,
        payload: {
          manualTestResult: ManualTestResultEnum.fail,
        },
      });
    }
  };

  const submitScanRequestMutation = useSubmitScanRequest(() =>
    toast("Re-Scan initiated, click here to view Scans page", {
      onClick: () => {},
    }),
  );

  const rescanEnabled = !submitScanRequestMutation.isLoading;

  const handleRescan = () => {
    if (rescanEnabled) {
      submitScanRequestMutation.mutate({
        appId: {
          id: applicationId,
        },
        scanType: ScanType.ViolationReScan,
        rescanViolationId: selectedViolationIdList,
      });
    }
  };
  const isLoadingMenu =
    createNewTicketMutation.isLoading ||
    postViolationMutation.isLoading ||
    submitScanRequestMutation.isLoading;
  return (
    <>
      <Menu
        transitionProps={{ transition: "pop-top-left" }}
        withinPortal
        position="bottom-start"
        withArrow
      >
        <Menu.Target>
          <Button
            disabled={!selectedViolationIdList.length}
            loading={isLoadingMenu}
          >
            Create task
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            disabled={!createNewTicketEnabled}
            onClick={handleCreateNewTicket}
            leftSection={<CreateTicketIcon className="h-6 w-6" />}
          >
            Mark as violation
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            disabled={!markAsViolation}
            onClick={handleMarkAsViolation}
            leftSection={<ValidateIcon className="h-6 w-6" />}
          >
            Push to Guided Validation
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            disabled={!rescanEnabled}
            onClick={handleRescan}
            leftSection={<ScanIcon fill="black" className="h-6 w-6" />}
          >
            Re-Scan
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Switch
        label="De-duplicate"
        labelPosition="left"
        checked={doDeduplicate}
        onChange={onDeduplicateChange}
        size="md"
      />
    </>
  );
};

const ManualTestResult = ({ value }: { value?: string }) => {
  switch (value) {
    case "passed":
    case "pass":
    case ManualTestResultEnum["pass"]:
      return (
        <div className="flex flex-col items-center justify-center space-y-0.5">
          <div className="flex h-8 w-8 items-center justify-center bg-blue-50">
            <Pass />
          </div>
          <div className="bg-blue-400 px-2 font-display font-semibold text-white">
            Pass
          </div>
        </div>
      );
    case "failed":
    case "fail":
    case ManualTestResultEnum["fail"]:
      return (
        <div className="flex flex-col items-center justify-center space-y-0.5">
          <div className="flex h-8 w-8 items-center justify-center bg-red-50">
            <Close />
          </div>
          <div className="bg-red-400 px-2 font-display font-semibold text-white">
            Fail
          </div>
        </div>
      );
    case "pending":
    case ManualTestResultEnum["pending"]:
      return (
        <div className="flex flex-col items-center justify-center space-y-0.5">
          <div className="flex h-8 w-8 items-center justify-center bg-yellow-50">
            <Exclamation />
          </div>
          <div className="bg-yellow-400 px-2 font-display font-semibold text-black">
            Pending
          </div>
        </div>
      );
    default:
      return <></>;
  }
};
function TableRowActions({
  row,
  modalDispatch,
}: {
  row: Row<Model>;
  modalDispatch: React.Dispatch<UseModalReducerAction>;
}) {
  // TODO: leaving this in to rework later with canvas
  // const [lightBoxOpen, setLightBoxOpen] = useState(false);
  // const handleSnapshotClick = () => {
  //   setLightBoxOpen(!lightBoxOpen);
  // };

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleRescanClick = () => {
    modalDispatch({
      type: "updateModalProps",
      payload: {
        showModal: true,
        content: `Confirm Violation Re-scan for ${row.original.ruleId} on URL: ${row.original.url}?`,
        onClickButton: async (id: string) => {
          if (id === "yes") {
            submitScanRequest({
              appId: {
                id: row.original.application?.id,
              },
              url: row.original.url,
              rescanViolationId: [row.original.id],
              scanType: ScanType.ViolationReScan,
            })
              .then(() => {
                queryClient.invalidateQueries(["ScansData"]);
              })
              .then(() => {
                navigate("/scans");
              });
          }
          modalDispatch({ type: "hideModal" });
        },
      },
    });
  };

  const { replay, isLoading: isReplayLoading } = useReplay();

  const handleReplayClick = useCallback(() => {
    replay(row.original.eventSequence);
  }, [row, replay]);

  const [doDeduplicate] = useGuidedDoDeduplicate();

  const validateUrl = getValidateUrl({
    appId: "",
    scanId: "",
    stateId: "",
    groupId: doDeduplicate ? row.original.groupId : "",
    url: "",
    element: "",
    violationId: row.original.id,
    ruleId: doDeduplicate ? "" : row.original.ruleId,
    isAutomated: false,
  });

  return (
    <Group align="center" justify="center" wrap="nowrap" gap="xs">
      {
        // TODO: leaving this in to rework later with canvas
        /* <button
        title="Open Snapshot"
        className=""
        onClick={handleSnapshotClick}
      >
        <SnapshotIcon className="h-6 w-6" />
        {lightBoxOpen && (
          <Lightbox
            onClose={() => setLightBoxOpen(false)}
            url={row.original.snapshotUrl}
            bounds={
              row.original?.bounds ?? {
                x: 0,
                y: 0,
                w: 0,
                h: 0,
              }
            }
          />
        )}
      </button>
      <VerticalSeparator className="h-6 bg-gray-400" /> */
      }
      <ActionIcon
        aria-label="Replay violation"
        disabled={isReplayLoading}
        onClick={handleReplayClick}
      >
        <ReplayIcon className="h-6 w-6" />
      </ActionIcon>
      <Divider orientation="vertical" />
      <ActionIcon aria-label="Re-scan violation" onClick={handleRescanClick}>
        <ScanIcon fill="black" />
      </ActionIcon>
      <Divider orientation="vertical" />
      <Link to={validateUrl} title="Validate">
        <ValidateIcon className="h-6 w-6" />
      </Link>
    </Group>
  );
}

type GuidedTableFooterElementProps = {
  table: ReactTable<ApiViolation>;
  allViolations?: ApiViolation[];
  isDataLoading: boolean;
  isDataError: boolean;
};

const pdfExportColumns = [
  "url",
  "manualTestResult",
  "rule.detailSuccessCriteria",
  "rule.successCriteriaDescription",
  "rule.name",
  "rule.detailLevel",
  "rule.issueCategory",
  "severity",
  "dupCount",
];

const GuidedTableFooterElement: React.FC<GuidedTableFooterElementProps> = ({
  allViolations = [],
  isDataLoading,
  isDataError,
}) => {
  const appName = useSelector(selectApplicationInfo)?.appName || "";
  const [doDeduplicate] = useGuidedDoDeduplicate();
  const [isExporting, setIsExporting] = useState(false);

  const handleClickExport = useCallback(() => {
    setIsExporting(true);
    exportTableAsPdfWithHtml(
      appName,
      "Violations Summary",
      allViolations,
      getApiViolationFields({
        dedupe: doDeduplicate,
      })
        .filter(
          (f) =>
            typeof f.value === "string" && !!pdfExportColumns.includes(f.value),
        )
        .map((f) => ({
          dataKey: typeof f.value === "string" ? f.value : f.label,
          header: f.label,
          columnWidth: f.width,
        })),
      document.getElementById("guided-summary"),
      images.violationPDFBackgroundImg,
    ).finally(() => setIsExporting(false));
  }, [allViolations, appName, doDeduplicate]);

  return (
    <Group justify="end">
      <ExportToCSVButton type="guided" />
      <Button
        onClick={handleClickExport}
        disabled={isDataLoading}
        loading={isExporting}
      >
        {isDataLoading ? "Loading..." : "Export to PDF"}
      </Button>
    </Group>
  );
};
