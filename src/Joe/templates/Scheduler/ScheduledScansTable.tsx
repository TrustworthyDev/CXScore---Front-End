import { ActionIcon, Box, Checkbox, Group, Text } from "@mantine/core";
import { ColumnDef, Row } from "@tanstack/react-table";
import clsx from "clsx";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Progressbar } from "@/atoms/Progressbar";
import { Table, TableActionProps } from "@/atoms/Table/MantineTable";
import { Settings } from "@/icons/Settings";
import { onChangeSelectedScan } from "@/reduxStore/app/app.actions";
import { ScanStatus, ScanSubType, ScanType } from "@/types/enum";
import { getFormattedDate } from "@/utils/stringUtils";
import { TextHeader } from "~/features/shared/Header/TextHeader";

const columns: ColumnDef<ApiScan>[] = [
  {
    id: "select",
    footer: "Select",
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        indeterminate={row.getIsSomeSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
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
        ? getFormattedDate(row.timeCompleted2)
        : "N/A",
    header: "END",
    cell: ({ getValue }) => <Text>{getValue<string>()}</Text>,
  },
  {
    id: "type",
    footer: "TYPE",
    accessorFn: (row) => row.config.scanType || ScanType.SinglePageScan,
    header: "TYPE",
    cell: ({ getValue }) => <Text>{getValue<string>()}</Text>,
  },
  {
    id: "subType",
    footer: "SUB TYPE",
    accessorFn: (row) => row.config.scanSubType || ScanSubType.RapidScan,
    header: "SUB TYPE",
    cell: ({ getValue }) => <Text>{getValue<string>()}</Text>,
  },
  {
    id: "status",
    footer: "STATUS",
    accessorFn: (row) =>
      row.status !== ScanStatus.Queued
        ? row.status === ScanStatus.Done
          ? "Done"
          : row.maxSteps || row.currentStep === row.maxSteps
            ? (row.currentStep - 1) / row.maxSteps
            : 0.99
        : "Queued",
    header: "STATUS",
    cell: ({ row, getValue }) =>
      row.original.status !== ScanStatus.Running ? (
        <Text>{getValue<string>()}</Text>
      ) : (
        <Group gap="xs">
          <Progressbar value={getValue<number>()} />
          <Text variant="tiny" className="ml-1 text-black">
            {`${!isNaN(getValue<number>()) ? (getValue<number>() * 100).toFixed(0) : 0}%`}
          </Text>
        </Group>
      ),
  },
  {
    id: "scannedPageCnt",
    footer: "NUMBER OF PAGES SCANNED",
    accessorFn: (row) => row.config.scanUrlList?.length || 1,
    header: "NUMBER OF PAGES SCANNED",
    cell: ({ getValue }) => <Text>{getValue<string>()}</Text>,
  },
];

const initialColumnVisibility = {
  // the other columns
  ...columns.reduce((acc, col) => ({ ...acc, [col.id as string]: false }), {}),
  select: true,
  id: true,
  startDate: true,
  endDate: true,
  type: true,
  subType: true,
  status: true,
  scannedPageCnt: true,
};

export type ScheduledScansTableProps = {
  title: string;
  scansData: ApiScan[];
};

export const ScheduledScansTable: React.FC<ScheduledScansTableProps> = ({
  title,
  scansData,
}) => {
  return (
    <Box py="lg">
      <TextHeader
        title={title}
        order={4}
        rightElement={
          <ActionIcon variant="transparent" aria-label="Settings">
            <Settings />
          </ActionIcon>
        }
      />
      <Box py="md">
        <Table
          data={scansData}
          initialColumnVisibility={initialColumnVisibility}
          columns={columns}
          ActionsElement={ScansTableActions}
        />
      </Box>
    </Box>
  );
};

function ScanIdCell({ row }: { row: Row<ApiScan> }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDone = row.original.status === ScanStatus.Done;
  const handleClickId = () => {
    if (!isDone) {
      return;
    }
    dispatch(onChangeSelectedScan({ scan: row.original }));
    navigate("/violations");
  };

  return (
    <Text
      c={isDone ? "primary" : "gray"}
      className={clsx(isDone && "cursor-pointer hover:underline")}
      onClick={handleClickId}
      role="button"
      tabIndex={0}
    >
      {row.original.id}
    </Text>
  );
}

const ScansTableActions: React.FC<TableActionProps<ApiScan>> = () => {
  return <></>;
};
