import { Box, Text } from "@mantine/core";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import React from "react";

import { usePerfUrlScans } from "@/api/useRequest";
import { InfoList } from "@/atoms/InfoList";
import { ScanType } from "@/types/enum";

interface Props {
  url: string;
  appId: string;
}

const scanTypeStr = {
  [ScanType.SinglePageScan]: "Single Page Scan",
  [ScanType.MultiPageScan]: "Multi Page Scan",
  [ScanType.FullPageScan]: "Full App Scan",
  [ScanType.ViolationReScan]: "Violation Re-Scan",
};

const scansListColumns: ColumnDef<ApiScan>[] = [
  {
    id: "scanType",
    accessorKey: "scanType",
    cell: (row) => (
      <Text c="primary">{scanTypeStr[row.getValue<ScanType>()]}</Text>
    ),
    sortingFn: "alphanumeric",
    header: "Scan Type",
    footer: "Scan Type",
  },
  {
    id: "Time",
    accessorKey: "timeCompleted",
    cell: (row) => (
      <span>{moment(row.getValue<string>()).format("Do MMMM YYYY")}</span>
    ),
    header: "Time",
    footer: "Time",
  },
  {
    id: "Status",
    accessorKey: "scanStatus",
    cell: (row) => <span>{row.getValue<string>()}</span>,
    header: "Status",
    footer: "Status",
  },
];
export const PerfScanList: React.FC<Props> = ({ url, appId }) => {
  const scansQuery = usePerfUrlScans({ appId, url });
  if (!scansQuery.data) {
    return <Box>Loading...</Box>;
  }
  return <InfoList data={scansQuery.data} columns={scansListColumns} />;
};
