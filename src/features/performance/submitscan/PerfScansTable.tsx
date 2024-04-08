import {
  ActionIcon,
  Box,
  Button,
  Group,
  Menu,
  Text,
  Title,
} from "@mantine/core";
import { ColumnDef, Row } from "@tanstack/react-table";
import clsx from "clsx";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { submitScanRequest } from "@/api";
import { Progressbar } from "@/atoms/Progressbar";
import { Table, TableActionProps } from "@/atoms/Table/MantineTable";
import { NewScheduleIcon } from "@/icons/NewSchedule";
import { ScanIcon } from "@/icons/ScanIcon";
import { ScanStatus, ScanSubType, ScanType } from "@/types/enum";
import { getFormattedDate } from "@/utils/stringUtils";

import PerfScansPageContext from "./PerfScansPageContext";
import {
  TableSelectionCell,
  TableSelectionHeader,
} from "../../../Sameer/components/page/common/table/selection";

const scanStatusString: Record<ScanStatus, string> = {
  [ScanStatus.Done]: "Done",
  [ScanStatus.Failed]: "Failed",
  [ScanStatus.Queued]: "Queued",
  [ScanStatus.Running]: "Running",
};

export type PerfScansTableProps = {
  title: string;
  scansData: ApiScan[];
};
function ScanIdCell({ row }: { row: Row<ApiScan> }) {
  const navigate = useNavigate();

  // can select the scan if it is done or failed
  const canOpen =
    row.original.status === ScanStatus.Done ||
    row.original.status === ScanStatus.Failed;

  const handleClickId = () => {
    if (!canOpen) {
      return;
    }
    navigate(`/performance/url/${row.original.id}`);
  };

  return (
    <Text
      c={canOpen ? "primary" : "gray"}
      className={clsx(canOpen && "cursor-pointer hover:underline")}
      onClick={handleClickId}
      role="button"
      tabIndex={0}
    >
      {row.original.id}
      {row.original.status === ScanStatus.Failed && " (Partially complete)"}
    </Text>
  );
}
function PerfScansTableRowActions({ row }: { row: Row<ApiScan> }) {
  const { refetchScans, setConfirmModalProps, setIsConfirmOpen } =
    useContext(PerfScansPageContext);
  const handleClickRescan = async () => {
    if (row.original.status !== ScanStatus.Done) {
      return;
    }
    setConfirmModalProps &&
      setConfirmModalProps({
        content: `Would you like to rescan ${row.original.id}?`,
        onClickButton: async (id: string) => {
          setIsConfirmOpen && setIsConfirmOpen(false);
          if (id === "yes") {
            await submitScanRequest(row.original.config);
            refetchScans && refetchScans();
          }
        },
      });
    setIsConfirmOpen && setIsConfirmOpen(true);
  };

  if (row.original.status === ScanStatus.Done) {
    return (
      <ActionIcon onClick={handleClickRescan} aria-label="Re-scan">
        <ScanIcon fill="black" />
      </ActionIcon>
    );
  }
  return (
    <Text ta="center" tt="uppercase" fw={500}>
      {row.original.status === ScanStatus.Failed ? "Failed" : "In\r\nProgress"}
    </Text>
  );
}
const columns: ColumnDef<ApiScan>[] = [
  {
    id: "select",
    footer: "Select",
    header: ({ table }) => <TableSelectionHeader table={table} />,
    cell: ({ row }) => <TableSelectionCell row={row} />,
  },
  {
    id: "id",
    footer: "SCAN ID",
    accessorFn: (row) => row.id,
    header: "SCAN ID",
    cell: ({ row }) => <ScanIdCell row={row} />,
  },
  {
    id: "startDate",
    footer: "START",
    accessorFn: (row) => getFormattedDate(row.timeStarted),
    header: "START",
    cell: ({ getValue }) => <Text>{getValue<string>()}</Text>,
  },
  {
    id: "endDate",
    footer: "END",
    accessorFn: (row) =>
      row.status === ScanStatus.Done
        ? getFormattedDate(row.timeCompleted)
        : "N/A",
    header: "END",
    cell: ({ getValue }) => <Text>{getValue<string>()}</Text>,
  },
  {
    id: "type",
    footer: "TYPE",
    accessorFn: (row) => row?.config?.scanType || ScanType.SinglePageScan,
    header: "TYPE",
    cell: ({ getValue }) => <Text>{getValue<string>()}</Text>,
  },
  {
    id: "subType",
    footer: "SUB TYPE",
    accessorFn: (row) => row?.config?.scanSubType || ScanSubType.RapidScan,
    header: "SUB TYPE",
    cell: ({ getValue }) => <Text>{getValue<string>()}</Text>,
  },
  {
    id: "status",
    footer: "STATUS",
    accessorFn: (row) =>
      row.status === ScanStatus.Running
        ? row.maxSteps || row.currentStep === row.maxSteps
          ? Math.max(Math.min((row.currentStep - 1) / row.maxSteps, 0.99), 0)
          : 0.99
        : scanStatusString[row.status],
    header: "STATUS",
    cell: ({ row, getValue }) =>
      row.original.status !== ScanStatus.Running ? (
        <Text>{getValue<string>()}</Text>
      ) : (
        <Group gap="xs">
          <Progressbar value={getValue<number>()} />
          <Text
            variant="tiny"
            className="ml-1 text-black"
          >{`${!isNaN(getValue<number>()) ? (getValue<number>() * 100).toFixed(0) : 0}%`}</Text>
        </Group>
      ),
  },
  {
    id: "scannedPageCnt",
    footer: "NUMBER OF PAGES SCANNED",
    accessorFn: (row) => row?.config?.scanUrlList?.length || 1,
    header: "NUMBER OF PAGES SCANNED",
    cell: ({ getValue }) => <Text>{getValue<string>()}</Text>,
  },
  {
    id: "violationCnt",
    footer: "VIOLATION COUNT",
    accessorFn: (row) => row.violationCount,
    header: "VIOLATION COUNT",
    cell: ({ getValue }) => <Text>{getValue<string>()}</Text>,
  },
  {
    id: "actions",
    footer: "RE-SCAN",
    header: "RE-SCAN",
    cell: ({ row }) => <PerfScansTableRowActions row={row} />,
  },
];

const initialColumnVisibility = {
  // the other columns
  ...columns.reduce((acc, col) => ({ ...acc, [col.id as string]: false }), {}),
  select: true,
  id: true,
  startDate: true,
  endDate: true,
  subType: true,
  type: true,
  status: true,
  scannedPageCnt: true,
  actions: true,
};
export const PerfScansTable: React.FC<PerfScansTableProps> = ({
  title,
  scansData,
}) => {
  return (
    <Box style={{ textAlign: "left" }} p="md">
      <Title order={4}>{title}</Title>
      <Box py="md">
        <Table
          data={scansData}
          initialColumnVisibility={initialColumnVisibility}
          columns={columns}
          ActionsElement={PerfScansTableActions}
        />
      </Box>
    </Box>
  );
};

const PerfScansTableActions: React.FC<TableActionProps<ApiScan>> = ({
  table,
}) => {
  const selectedRows = table.getSelectedRowModel().rows;
  const { refetchScans, setConfirmModalProps, setIsConfirmOpen } =
    useContext(PerfScansPageContext);
  const handleClickRescan = async () => {
    const row = selectedRows.at(0);
    if (!row || row.original.status !== ScanStatus.Done) {
      return;
    }
    setConfirmModalProps &&
      setConfirmModalProps({
        content: `Would you like to rescan ${row.original.id}?`,
        onClickButton: async (id: string) => {
          setIsConfirmOpen && setIsConfirmOpen(false);
          if (id === "yes") {
            await submitScanRequest(row.original.config);
            refetchScans && refetchScans();
          }
        },
      });
    setIsConfirmOpen && setIsConfirmOpen(true);
  };

  return (
    <Menu
      transitionProps={{ transition: "pop-top-left" }}
      withinPortal
      position="bottom-start"
      withArrow
    >
      <Menu.Target>
        <Button disabled={!selectedRows.length}>Create task</Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item leftSection={<NewScheduleIcon className="h-6 w-6" />}>
          Schedule scan
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          onClick={handleClickRescan}
          leftSection={<ScanIcon fill="black" className="h-6 w-6" />}
        >
          Re-scan
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
