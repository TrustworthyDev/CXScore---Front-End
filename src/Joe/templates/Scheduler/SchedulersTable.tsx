import { ActionIcon, Box, Group, Switch, Text } from "@mantine/core";
import { ColumnDef, Row } from "@tanstack/react-table";
import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import { Table, TableActionProps } from "@/atoms/Table/MantineTable";
import { Settings } from "@/icons/Settings";
import {
  onChangeSelectedScan,
  onChangeSelectedScheduler,
} from "@/reduxStore/app/app.actions";
import { ScanType } from "@/types/enum";
import { getFormattedTime } from "@/utils/stringUtils";
import { TextHeader } from "~/features/shared/Header/TextHeader";

import SchedulerPageContext from "./SchedulerPageContext";
import {
  TableSelectionCell,
  TableSelectionHeader,
} from "../../../Sameer/components/page/common/table/selection";

const LinkToDashboard = (props: { data: ApiScheduler }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const latestScan =
    props.data.scan && props.data.scan.length > 0 ? props.data.scan[0] : null;
  const handleClick = () => {
    if (latestScan) {
      dispatch(
        onChangeSelectedScan({
          scan: latestScan,
        }),
      );
      dispatch(
        onChangeSelectedScheduler({
          scheduler: props.data,
        }),
      );
      navigate("/home");
    }
  };

  return (
    <>
      {latestScan ? (
        <Box
          className="cursor-pointer text-blue-500 underline"
          onClick={handleClick}
        >
          {props.data.scanName}
        </Box>
      ) : (
        <Box>{props.data.scanName}</Box>
      )}
    </>
  );
};

const ActiveControlCell = ({
  row,
  checked,
}: {
  row: Row<ApiScheduler>;
  checked: boolean;
}) => {
  const { refetchSchedulers, onUpdateSchedulerActiveStatus, curActiveStatus } =
    useContext(SchedulerPageContext);
  const finalChecked = curActiveStatus[row.original.id] ?? checked;

  const handleChange = async () => {
    onUpdateSchedulerActiveStatus?.({
      schedulerId: row.original.id,
      active: !finalChecked,
    });
    refetchSchedulers?.();
  };

  return <Switch checked={finalChecked} onChange={handleChange} />;
};

export type ScansTableProps = {
  scheduleData: ApiScheduler[];
};

const columns: ColumnDef<ApiScheduler>[] = [
  {
    id: "select",
    footer: "Select",
    header: ({ table }) => <TableSelectionHeader table={table} />,
    cell: ({ row }) => <TableSelectionCell row={row} />,
  },
  {
    id: "scanName",
    footer: "SCAN NAME",
    accessorFn: (row) => row.scanName,
    header: "SCAN NAME",
    cell: ({ row }) => <LinkToDashboard data={row.original} />,
  },
  {
    id: "frequency",
    footer: "EVERY",
    accessorFn: (row) => row.frequency,
    header: "EVERY",
    cell: ({ getValue }) => <Text>{getValue<string>()}</Text>,
  },
  {
    id: "timeOfDayInSeconds",
    footer: "AT",
    accessorFn: (row) => row.timeOfDayInSeconds,
    header: "AT",
    cell: ({ getValue }) => <Text>{getFormattedTime(getValue<number>())}</Text>,
  },
  {
    id: "startDate",
    footer: "FROM",
    accessorFn: (row) => row.startDate.toDateString(),
    header: "FROM",
    cell: ({ getValue }) => <Text>{getValue<string>()}</Text>,
  },
  {
    id: "endDate",
    footer: "Ends On",
    accessorFn: (row) =>
      row.endDate === "never" ? "Never" : row.endDate.toDateString(),
    header: "Ends On",
    cell: ({ getValue }) => <Text>{getValue<string>()}</Text>,
  },
  {
    id: "type",
    footer: "TYPE",
    accessorFn: (row) =>
      row.urlList.length > 1 ? ScanType.MultiPageScan : ScanType.SinglePageScan,
    header: "TYPE",
    cell: ({ getValue }) => <Text>{getValue<string>()}</Text>,
  },
  {
    id: "subType",
    footer: "SUB TYPE",
    accessorFn: (row) => row.scanType,
    header: "SUB TYPE",
    cell: ({ getValue }) => <Text>{getValue<string>()}</Text>,
  },
  {
    id: "activeStatus",
    footer: "ACTIVE",
    accessorFn: (row) => row.active ?? true,
    header: "ACTIVE",
    cell: ({ row, getValue }) => (
      <ActiveControlCell row={row} checked={getValue<boolean>()} />
    ),
  },
];

const initialColumnVisibility = {
  // the other columns
  ...columns.reduce((acc, col) => ({ ...acc, [col.id as string]: false }), {}),
  select: true,
  scanName: true,
  frequency: true,
  timeOfDayInSeconds: true,
  startDate: true,
  endDate: true,
  scanType: true,
  activeStatus: true,
};
export const SchedulersTable: React.FC<ScansTableProps> = ({
  scheduleData,
}) => {
  return (
    <Box py="md">
      <TextHeader
        title="Scheduler"
        rightElement={
          <ActionIcon aria-label="settings" variant="transparent">
            <Settings />
          </ActionIcon>
        }
      />
      <Box py="md">
        <Table
          data={scheduleData}
          initialColumnVisibility={initialColumnVisibility}
          columns={columns}
          ActionsElement={SchedulersTableActions}
        />
      </Box>
    </Box>
  );
};

const SchedulersTableActions: React.FC<TableActionProps<ApiScheduler>> = () => {
  // const selectedRows = table.getSelectedRowModel().rows;
  // const [isProcessing, setIsProcessing] = useState(false);

  return (
    <Group align="center">
      {
        //Disable for now
        /* <Button
        className="w-32 bg-brand-600"
        disabled={true || !selectedRows.length}
        loading={isProcessing}
      >
        <Text>Edit</Text>
      </Button> */
      }
      {/* <Button
        className="w-32 bg-red-600"
        disabled={!selectedRows.length}
        onClick={handleDeleteRows}
        loading={isProcessing}
      >
        <Text>Delete</Text>
      </Button> */}
    </Group>
  );
};
