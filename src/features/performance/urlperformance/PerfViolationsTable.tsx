import { Box, Text, Title } from "@mantine/core";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";

import { Table } from "@/atoms/Table/MantineTable";

interface Props {
  violations: ApiPerfViolation[];
}
const columns: ColumnDef<ApiPerfViolation>[] = [
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
    cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
  },
  {
    id: "severity",
    footer: "Severity",
    accessorFn: (row) => row.severity,
    cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
    header: "Severity",
  },
  {
    id: "actionType",
    footer: "Action Type",
    accessorFn: (row) => row.actionType,
    cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
    header: "Action Type",
  },
  {
    id: "metricType",
    footer: "Metric Type",
    accessorFn: (row) => row.ruleId,
    cell: ({ getValue }) => (
      <Text size="sm">{getValue<string>().slice(16)}</Text>
    ),
    header: "Metric Type",
  },
  {
    id: "ruleId",
    footer: "Rule ID",
    accessorFn: (row) => row.ruleId,
    cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
    header: "Rule ID",
  },
  {
    id: "successCriteriaDescription",
    footer: "Success Criteria Description",
    accessorFn: (row) => row.successCriteriaDescription,
    header: "Success Criteria Description",
    cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
  },
  // {
  //   id: "remediationSummary",
  //   footer: "Remediation Summary",
  //   accessorFn: (row) => row.remediationSummary,
  //   header: "Remediation Summary",
  //   cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
  // },
  {
    id: "ticketStatus",
    footer: "Ticket Status",
    accessorFn: (row) => row.ticketStatus,
    cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
    header: "Ticket Status",
  },

  {
    id: "scanId",
    header: "Scan ID",
    footer: "Scan ID",
    accessorFn: (row) =>
      // check if row.scanId is an array and get the last element
      row?.scanId?.length ? row.scanId[row.scanId.length - 1] : row.scanId,
  },
];

const initialColumnVisibility = {
  // the other columns
  ...columns.reduce((acc, col) => ({ ...acc, [col.id as string]: false }), {}),
  url: true,
  severity: true,
  actionType: true,
  ruleId: true,
  successCriteriaDescription: true,
};

export const PerfViolationsTable: React.FC<Props> = ({ violations }) => {
  return (
    <Box>
      <Title order={3}>Violations</Title>
      <Box ml="xl" mt="md">
        {violations.length ? (
          <Table
            data={violations}
            initialColumnVisibility={initialColumnVisibility}
            columns={columns}
            tableName="perfViolations"
          />
        ) : (
          <Text>No Violations</Text>
        )}
      </Box>
    </Box>
  );
};
