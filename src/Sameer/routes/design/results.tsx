import { submitScanRequest, useScanStatus } from "@/api";
import { Confirmation } from "@/atoms/Confirmation/Confirmation";
import { Table, TableExpandProps, TableRef } from "@/atoms/Table/MantineTable";
import { ReplayIcon } from "@/icons/Replay";
import { ScanIcon } from "@/icons/ScanIcon";
import { ValidateIcon } from "@/icons/Validate";
import { ScanType } from "@/types/enum";
import { getValidateUrl } from "@/utils/navigateUtils";
import {
  ActionIcon,
  Anchor,
  Box,
  Divider,
  Group,
  LoadingOverlay,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import {
  SortingState,
  PaginationState,
  ColumnDef,
  Row,
} from "@tanstack/react-table";
import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ExternalLink } from "~/Sameer/components/atoms/external-link/external-link";
import { SmallSpinner } from "~/Sameer/components/atoms/loading";
import {
  TableExpandHeader,
  TableExpandCell,
} from "~/Sameer/components/page/common/table/expansion";
import { TicketLink } from "~/Sameer/components/page/common/ticket-link/ticket-link";
import { ViolationDetail } from "~/Sameer/components/page/violations/violation-filter-table-sub-component";
import { useReplay } from "~/Sameer/lib/replay";
import { generateIssueDescription } from "~/Sameer/lib/util/table-utils";
import { useLocalStorageState } from "~/Sameer/lib/util/use-local-storage-state";
import {
  UseModalReducerAction,
  useModalReducer,
} from "~/Sameer/lib/util/use-modal-reducer";
import {
  useCountViolation,
  useViolationsCheckedFilters,
} from "~/Sameer/lib/violations/count";
import { useViolationsDoDeduplicate } from "~/Sameer/lib/violations/dedupe";
import { useQueryViolation } from "~/Sameer/lib/violations/query";
import { DeviceIcon } from ".";
import { Pie, ResponsivePie } from "@nivo/pie";

export const DesignScanResultsRoute = () => {
  const scanId = useParams().id;

  const scanQuery = useScanStatus(scanId ?? "");
  const url =
    scanQuery.data?.config.url || scanQuery.data?.config.scanUrlList![0] || "";
  const profilesUsed = scanQuery.data?.config.profiles ?? [];

  const byRule = useCountViolation({
    fieldMatchQueryOpts: {
      scanId,
    },
    countByFields: ["rule.id"],
  });

  const byDevice = useCountViolation({
    fieldMatchQueryOpts: {
      scanId,
    },
    countByFields: ["profile.device"],
  });

  console.log(byRule.data);
  console.log(byDevice.data);

  const isLoadingCounts =
    byRule.isLoading || byDevice.isLoading || scanQuery.isLoading;

  if (!scanId) {
    return <div>Scan ID not found</div>;
  }

  return (
    <Stack px="md" py="lg">
      <Title order={1}>Design Scan Results</Title>
      <Link to="/design">
        <Anchor>Click to go back to Scans</Anchor>
      </Link>
      <Divider />
      <Stack className="relative">
        <LoadingOverlay visible={scanQuery.isLoading} />
        <Title order={2}>Scan Results for {url}</Title>
        {!isLoadingCounts ? (
          <Box className="grid min-h-[350px] grid-cols-1 md:grid-cols-2">
            <Stack className="text-center">
              <Text size="lg">Total Violations by Device</Text>
              <Box className="h-full">
                <ResponsivePie
                  borderWidth={1}
                  enableArcLabels
                  colors={{
                    scheme: "pastel1",
                  }}
                  data={
                    byDevice.data?.at(0)?.values.map(
                      (item) =>
                        ({
                          id: item.value.toLocaleUpperCase(),
                          value: item.count,
                        }) as any,
                    ) as any
                  }
                />
              </Box>
            </Stack>
            <Stack className="text-center">
              <Text size="lg">Total Violations by Rule</Text>
              <Box className="h-full">
                <ResponsivePie
                  borderWidth={1}
                  enableArcLabels
                  colors={{
                    scheme: "pastel2",
                  }}
                  data={
                    byRule.data?.at(0)?.values.map(
                      (item) =>
                        ({
                          id: item.value.toLocaleUpperCase(),
                          value: item.count,
                        }) as any,
                    ) as any
                  }
                />
              </Box>
            </Stack>
          </Box>
        ) : (
          <Skeleton className="h-[300px]" />
        )}
        <Divider />
        <Title order={3}>Profiles Table</Title>
        <Text>This scan was run with {profilesUsed.length} profiles.</Text>
        <Text>
          Click the expand button below on each profile row to see violations
          for that profile.
        </Text>
        <ProfilesTable profiles={profilesUsed} scanId={scanId} />
        <Divider />
        <Title order={3}>All Violations Table</Title>
        <ViolationsTable scanId={scanId} />
      </Stack>
    </Stack>
  );
};

const TotalViolationsCount = ({
  profile,
  scanId,
}: {
  profile?: DefaultScanConfig;
  scanId: string;
}) => {
  const { isLoading, isError, data } = useQueryViolation({
    fieldMatchQueryOpts: {
      scanId,
      profile,
    },
    outputOpts: {
      pagination: {
        pageIndex: 0,
        pageSize: 1,
      },
    },
  });

  if (isLoading) {
    return <SmallSpinner />;
  }

  if (isError) {
    return <Text>Error</Text>;
  }

  return <Text>{data.totalCount}</Text>;
};

const ProfilesTable = (props: {
  profiles: DefaultScanConfig[];
  scanId: string;
}) => {
  const { profiles, scanId } = props;

  const ProfileDetailExpandElement = useCallback(
    ({ data }: TableExpandProps<DefaultScanConfig>) => (
      <ViolationsTable profile={data} scanId={scanId} />
    ),
    [],
  );

  const columns: ColumnDef<DefaultScanConfig>[] = useMemo(
    () => [
      {
        id: "expand",
        footer: "Expand",
        header: ({ table }) => <TableExpandHeader table={table} />,
        cell: ({ row }) => <TableExpandCell row={row} />,
      },
      {
        id: "profile.device",
        header: "Device",
        footer: "Device",
        accessorFn: (row) => row.device,
        cell: ({ getValue }) => (
          <Group justify="center">
            <DeviceIcon device={getValue<string>()} />
            <Text size="sm" className="capitalize">
              {getValue<string>()}
            </Text>
          </Group>
        ),
      },
      {
        id: "profile.windowSize",
        header: "Window Size",
        footer: "Window Size",
        accessorFn: (row) => row.windowSize,
        cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
      },
      {
        id: "profile.orientation",
        header: "Orientation",
        footer: "Orientation",
        accessorFn: (row) => row.orientation,
        cell: ({ getValue }) => (
          <Text size="sm" className="capitalize">
            {getValue<string>()}
          </Text>
        ),
      },
      {
        id: "profile.deviceScaleFactor",
        header: "Device Scale Factor",
        footer: "Device Scale Factor",
        accessorFn: (row) => row.deviceScaleFactor,
        cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
      },
      {
        id: "profile.defaultFontSize",
        header: "Default Font Size",
        footer: "Default Font Size",
        accessorFn: (row) => row.defaultFontSize,
        cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
      },
      {
        id: "profile.violations",
        header: "Violations Count",
        footer: "Violations Count",
        cell: ({ row }) => (
          <TotalViolationsCount scanId={scanId} profile={row.original} />
        ),
      },
    ],
    [],
  );

  return (
    <Table
      data={profiles}
      columns={columns}
      ExpandElement={ProfileDetailExpandElement}
      withQuickSearch={false}
      initialColumnVisibility={{
        expand: true,
        select: true,
        "profile.device": true,
        "profile.windowSize": true,
        "profile.orientation": true,
        "profile.deviceScaleFactor": true,
        "profile.defaultFontSize": true,
      }}
    />
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

export function ViolationsTable({
  scanId,
  profile,
}: {
  scanId: string;
  profile?: DefaultScanConfig;
}): JSX.Element {
  const ViolationDetailExpandElement = useCallback(
    ({ data }: TableExpandProps<ApiViolation>) => (
      <ViolationDetail
        showProfile
        violation={data}
        showDuplicateTable={"violation"}
      />
    ),
    [],
  );

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

  const { data, isLoading, isError, isFetching, isRefetching } =
    useQueryViolation({
      fieldMatchQueryOpts: {
        scanId,
        profile,
      },
      outputOpts: { pagination, textSearch: search, sort: sorting },
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
        id: "profile.device",
        header: "Device",
        footer: "Device",
        accessorFn: (row) => row.profile?.device,
        cell: ({ getValue }) => (
          <Group justify="center">
            <DeviceIcon device={getValue<string>()} />
            <Text size="sm" className="capitalize">
              {getValue<string>()}
            </Text>
          </Group>
        ),
      },
      {
        id: "profile.windowSize",
        header: "Window Size",
        footer: "Window Size",
        accessorFn: (row) => row.profile?.windowSize,
        cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
      },
      {
        id: "profile.orientation",
        header: "Orientation",
        footer: "Orientation",
        accessorFn: (row) => row.profile?.orientation,
        cell: ({ getValue }) => (
          <Text size="sm" className="capitalize">
            {getValue<string>()}
          </Text>
        ),
      },
      {
        id: "profile.deviceScaleFactor",
        header: "Device Scale Factor",
        footer: "Device Scale Factor",
        accessorFn: (row) => row.profile?.deviceScaleFactor,
        cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
      },
      {
        id: "profile.defaultFontSize",
        header: "Default Font Size",
        footer: "Default Font Size",
        accessorFn: (row) => row.profile?.defaultFontSize,
        cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
      },
      {
        id: "profile.violations",
        header: "Violations Count",
        footer: "Violations Count",
        cell: ({ row }) => (
          <TotalViolationsCount
            scanId={scanId}
            profile={row.original.profile}
          />
        ),
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
    // "rule.detailSuccessCriteria": true,
    // "rule.successCriteriaDescription": true,
    "rule.name": true,
    // "rule.disability": true,
    // "rule.detailWcag2021": true,
    // "rule.detailLevel": true,
    // "rule.issueCategory": true,
    severity: true,
    // "rule.type": true,
    // ticketStatus: true,
    // dupCount: true,
    snapshotUrl: false,
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

  if (isLoading) {
    return <ViolationsFilterTableSkeleton />;
  }

  if (isError) {
    return <div className="text-red">Error</div>;
  }

  return (
    <Stack>
      {data.totalCount === 0 ? (
        <Text>No items found</Text>
      ) : (
        <Table
          isRefetching={isRefetching}
          ref={tableRef}
          data={data?.result}
          initialColumnVisibility={initialColumnVisibility}
          columns={columns}
          onSearchChange={handleChangeSearch}
          ExpandElement={ViolationDetailExpandElement}
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
      )}
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
    </Stack>
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

