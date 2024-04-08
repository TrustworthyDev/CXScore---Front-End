import {
  useCallback,
  useState,
  MouseEvent,
  useRef,
  useMemo,
  Dispatch,
  useEffect,
} from "react";
import {
  CellContext,
  ColumnDef,
} from "@tanstack/react-table";
import { SnapshotIcon } from "@/icons/Snapshot";
import { ValidateIcon } from "@/icons/Validate";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "../../atoms/loading/skeleton";
import { ScanIcon } from "@/icons/ScanIcon";
import {
  UrlStatus,
  useGuidedCheckedFilters,
  useGuidedCountByUrl,
} from "../../../lib/guided/count";
import { ScanType, ScanSubType } from "@/types/enum";
import { ViolationsUrlTableSkeleton } from "../violations/violations-url-table";
import { submitScanRequest } from "@/api";
import {
  selectApplicationInfo,
  selectSelectedScan,
} from "@/reduxStore/app/app.reducer";
import { useSelector } from "react-redux";
import { Confirmation } from "@/atoms/Confirmation";
import {
  UseModalReducerAction,
  useModalReducer,
} from "../../../lib/util/use-modal-reducer";
import { useQueryClient } from "@tanstack/react-query";
import { ExternalLink } from "../../atoms/external-link/external-link";
import { getValidateUrl, gotoValidate } from "@/utils/navigateUtils";
import { useViolations } from "../../../lib/violations/query";
import { Table, TableRef } from "@/atoms/Table/MantineTable";
import { ActionIcon, Divider, Group, Stack, Text, Title } from "@mantine/core";

type Row = UrlStatus;

const Actions = ({
  row,
  modalDispatch,
}: {
  row: CellContext<Row, unknown>;
  modalDispatch: Dispatch<UseModalReducerAction>;
}) => {
  const navigate = useNavigate();
  const query = useViolations({
    outputOpts: {
      getAllViolations: true,
    },
  });

  const selectedApplicationId = useSelector(selectApplicationInfo)?.appId ?? "";
  const selectedApplicationName =
    useSelector(selectApplicationInfo)?.appName ?? "";
  const selectedScanId = useSelector(selectSelectedScan)?.id || "";

  const firstViolation = useMemo(
    () => query.data?.result?.find((item) => item.url === row.row.original.url),
    [row.row.original.url, query.data]
  );

  const handleSnapshotClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (firstViolation) {
        gotoValidate({
          navigate,
          appId: selectedApplicationId,
          scanId: selectedScanId,
          stateId: "",
          element: "",
          url: firstViolation.url,
          violationId: "",
          ruleId: "",
          ctrlKey: e.ctrlKey || e.metaKey,
          isAutomated: false,
        });
      }
    },
    [firstViolation, navigate, selectedApplicationId, selectedScanId]
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
    url: firstViolation ? firstViolation.url : "",
    violationId: "",
    ruleId: "",
    isAutomated: false,
  });

  if (query.isLoading) {
    return (
      <div className="flex justify-center gap-2">
        <Skeleton className="!h-6 !w-6" />
        <Skeleton className="!h-6 !w-6" />
        <Skeleton className="!h-6 !w-6" />
      </div>
    );
  }

  if (query.isError) {
    return <div>Error</div>;
  }

  if (!query.data) {
    return null;
  }

  return (
    <Group align="center" justify="center" wrap="nowrap" gap="xs">
      <ActionIcon aria-label="Show snapshot"  onClick={handleSnapshotClick}>
        <SnapshotIcon className="h-6 w-6" />
      </ActionIcon>
      <Divider orientation="vertical"/>
      <ActionIcon aria-label="Re-scan"  onClick={handleRescanClick}>
        <ScanIcon fill="black" />
      </ActionIcon>
      <Divider orientation="vertical"/>
      <Link to={validateUrl} title="Validate">
        <ValidateIcon className="h-6 w-6" />
      </Link>
    </Group>
  );
};
export const GuidedUrlTable = () => {
  const tableRef = useRef<TableRef>(null);

  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useGuidedCountByUrl({
    clientTextSearch: search,
  });

  const { modalProps, modalDispatch } = useModalReducer();

  const columns: ColumnDef<Row>[] = useMemo(
    () => [
      {
        id: "url",
        accessorFn: (row) => row.url,
        cell: (row) => (
          <div className="inline-block max-w-[65vw] overflow-hidden whitespace-nowrap">
            <ExternalLink href={row.getValue<string>()} label={row.getValue<string>()} />
          </div>
        ),
        sortingFn: "alphanumeric",
        header: "URL",
        footer: "URL",
      },
     {
        id: "total",
        accessorFn: (row) => row.total,
        cell: (row) => <Text>{row.getValue<string>()}</Text>,
        sortingFn: "alphanumeric",
        header: "Elements",
        footer: "Elements",
      },
      {
        id: "pending",
        accessorFn: (row) => row.pending,
        cell: (row) => <Text>{row.getValue<string>()}</Text>,
        sortingFn: "alphanumeric",
        header: "Pending",
        footer: "Pending",
      },
      {
        id: "pass",
        accessorFn: (row) => row.pass,
        cell: (row) => <Text>{row.getValue<string>()}</Text>,
        sortingFn: "alphanumeric",
        header: "Pass",
        footer: "Pass",
      },
      {
        id: "fail",
        accessorFn: (row) => row.failed,
        cell: (row) => <Text>{row.getValue<string>()}</Text>,
        sortingFn: "alphanumeric",
        header: "Fail",
        footer: "Fail",
      },
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

  const handleChangeSearch = useCallback((val: string) => setSearch(val), []);

  if (isLoading) {
    return <ViolationsUrlTableSkeleton />;
  }

  if (isError) {
    return <div className="text-red-500">Error</div>;
  }

  return (
    <>
      <Table
        data={data}
        columns={columns}
        withBorder={false}
        withColumnVisibility={false}
        onSearchChange={handleChangeSearch}
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

export const GuidedUrlTableView = () => {
  return (
    <Stack py="md" gap="md">
      <Title order={3}>Top URLs for Manual Validation</Title>
      <GuidedUrlTable />
    </Stack>
  );
};
