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
import { CreateTicketIcon } from "@/icons/CreateTicket";
import { ReplayIcon } from "@/icons/Replay";
import { ScanIcon } from "@/icons/ScanIcon";
import { ValidateIcon } from "@/icons/Validate";
import { selectApplicationInfo } from "@/reduxStore/app/app.reducer";
import { ManualTestResult, ScanType } from "@/types/enum";
import { exportTableAsPdfWithHtml } from "@/utils";
import { getValidateUrl } from "@/utils/navigateUtils";
import images from "~/assets";

import { ViolationDetail } from "./violation-filter-table-sub-component";
import { useSelectedAppId } from "../../../lib/application/use-application-data";
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
import { useViolationsCheckedFilters } from "../../../lib/violations/count";
import { useViolationsDoDeduplicate } from "../../../lib/violations/dedupe";
import { useViolations } from "../../../lib/violations/query";
import { ExternalLink } from "../../atoms/external-link/external-link";
import { SmallSpinner } from "../../atoms/loading";
import { Skeleton } from "../../atoms/loading/skeleton";
import { TableExpandCell, TableExpandHeader } from "../common/table/expansion";
import { ExportToCSVButton } from "../common/table/export-to-csv";
import {
  TableSelectionCell,
  TableSelectionHeader,
} from "../common/table/selection";
import { TicketLink } from "../common/ticket-link/ticket-link";

export const ViolationsFilterTable = () => {
  return <ViolationsTable />;
};

export function ViolationsTable(): JSX.Element {
  const tableRef = useRef<TableRef>(null);
  const { modalProps, modalDispatch } = useModalReducer();
  const [search, setSearch] = useState("");

  const [sorting, setSorting] = useLocalStorageState<SortingState>(
    "violations/sorting",
    [],
  );

  const [pagination, setPagination] = useLocalStorageState<PaginationState>(
    "violations/pagination",
    {
      pageIndex: 0,
      pageSize: 10,
    },
  );

  const { data, isLoading, isError, isFetching, isRefetching } = useViolations({
    outputOpts: {
      pagination,
      textSearch: search,
      sort: sorting,
    },
  });

  const columns: ColumnDef<ApiViolation>[] = useMemo(
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
            labelMaxCharacters={30}
          />
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
            {getValue<number>() > 1 ? getValue<number>() : "Not found"}
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
          return isFetching ? (
            <SmallSpinner />
          ) : (
            <Text size="sm">{row.original.notes}</Text>
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
    "rule.detailSuccessCriteria": true,
    // "rule.successCriteriaDescription": true,
    "rule.name": true,
    // "rule.disability": true,
    "rule.detailWcag2021": true,
    "rule.detailLevel": true,
    "rule.issueCategory": true,
    severity: true,
    "rule.type": true,
    ticketStatus: true,
    dupCount: true,
    snapshotUrl: false,
    actions: true,
  };

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

  // SEARCH
  const handleChangeSearch = useCallback(
    (searchText: string) => setSearch(searchText.toLowerCase()),
    [],
  );

  // all data for export
  const { data: allData, isLoading: isAllDataLoading } = useViolations({
    outputOpts: {
      getAllViolations: true,
      fields: ViolationFieldNamesForExport,
    },
  });

  const ViolationDetailExpandElement = useCallback(
    ({ data }: TableExpandProps<ApiViolation>) => (
      <ViolationDetail violation={data} showDuplicateTable={"violation"} />
    ),
    [],
  );
  const ViloationFooterElement = useCallback(
    ({ table }: TableFooterProps<ApiViolation>) => (
      <ViolationTableFooter
        table={table}
        isDataLoading={isAllDataLoading}
        allViolations={allData?.result}
      />
    ),
    [allData?.result, isAllDataLoading],
  );

  if (isLoading) {
    return <ViolationsFilterTableSkeleton />;
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
        ActionsElement={ViolationsTableActions}
        onSearchChange={handleChangeSearch}
        ExpandElement={ViolationDetailExpandElement}
        FooterElement={ViloationFooterElement}
        tableName="violations"
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

export const ViolationsFilterTableSkeleton = () => {
  return (
    <div className="w-full space-y-2">
      {[...Array(5)].map((_, index) => (
        <Skeleton key={index} className="!h-4 !w-full" />
      ))}
    </div>
  );
};

function TableRowActions({
  row,
  modalDispatch,
}: {
  row: Row<ApiViolation>;
  modalDispatch: React.Dispatch<UseModalReducerAction>;
}) {
  // TODO: leaving this in to rework later - snapshot through canvas api
  // const [lightBoxOpen, setLightBoxOpen] = useState(false);
  const navigate = useNavigate();

  // TODO: leaving this in to rework later - snapshot through canvas api
  // const handleSnapshotClick = () => {
  //   setLightBoxOpen(!lightBoxOpen);
  // };

  const queryClient = useQueryClient();

  const handleRescanClick = () => {
    modalDispatch({
      type: "updateModalProps",
      payload: {
        showModal: true,
        content: `Confirm Violation Re-scan for ${row.original.ruleId} on URL: ${row.original.url}?`,
        onClickButton: (id: string) => {
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
  }, [replay, row.original.eventSequence]);

  const [doDeduplicate] = useViolationsDoDeduplicate();
  const validateUrl = getValidateUrl({
    appId: "",
    scanId: "",
    stateId: "",
    groupId: doDeduplicate ? row.original.groupId : "",
    element: "",
    url: "",
    violationId: row.original.id,
    ruleId: doDeduplicate ? "" : row.original.ruleId,
    isAutomated: true,
  });

  return (
    <Group align="center" justify="center" wrap="nowrap" gap="xs">
      {/* 
      // TODO: leaving this in to rework later - snapshot through canvas api
      <button title="Open Snapshot" className="" onClick={handleSnapshotClick}>
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
      <VerticalSeparator className="h-6 bg-gray-400" /> */}
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

const ViolationsTableActions: React.FC<TableActionProps<ApiViolation>> = ({
  table,
}) => {
  const navigate = useNavigate();
  const applicationId = useSelectedAppId() ?? "";
  const selectedRows = table.getSelectedRowModel().rows;
  const selectedViolationIdList = selectedRows.map((row) => row.original.id);

  const [doDeduplicate, setDoDeduplicate] = useViolationsDoDeduplicate();

  const createNewTicketMutation = useCreateNewTicket(() =>
    toast("JIRA created successfully"),
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
      `Violation${
        selectedViolationIdList.length >= 2 ? "s" : ""
      } pushed to Guided Validation Studio`,
    ),
  );

  const moveToGuidedEnabled = !postViolationMutation.isLoading;

  const handleMoveToGuided = () => {
    if (moveToGuidedEnabled) {
      postViolationMutation.mutate({
        violationIds: selectedViolationIdList,
        payload: {
          manualTestResult: ManualTestResult.pending,
        },
      });
    }
  };

  const submitScanRequestMutation = useSubmitScanRequest(() =>
    toast("Re-Scan initiated, click here to view Scans page", {
      onClick: () => navigate("/scans"),
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

  const onDeduplicateChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setDoDeduplicate(e.target.checked);

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
            Create JIRA
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item
            disabled={!moveToGuidedEnabled}
            onClick={handleMoveToGuided}
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

type VilationTableFooterProps = {
  table: ReactTable<ApiViolation>;
  allViolations?: ApiViolation[];
  isDataLoading: boolean;
};

const pdfExportColumns = [
  "url",
  "rule.detailSuccessCriteria",
  "rule.successCriteriaDescription",
  "rule.name",
  "rule.detailWcag2021",
  "rule.detailLevel",
  "rule.issueCategory",
  "severity",
  "rule.type",
  "ticketStatus",
  "dupCount",
];

const ViolationTableFooter: React.FC<VilationTableFooterProps> = ({
  allViolations = [],
  isDataLoading,
}) => {
  const appName = useSelector(selectApplicationInfo)?.appName || "";
  const [doDeduplicate] = useViolationsDoDeduplicate();

  const handleClickExportPdf = useCallback(() => {
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
      document.getElementById("violation-summary"),
      images.violationPDFBackgroundImg,
    );
  }, [allViolations, appName, doDeduplicate]);

  return (
    <Group justify="end">
      <ExportToCSVButton type="violation" />
      <Button
        onClick={handleClickExportPdf}
        loading={isDataLoading}
        variant="primary"
      >
        Export to PDF
      </Button>
    </Group>
  );
};
