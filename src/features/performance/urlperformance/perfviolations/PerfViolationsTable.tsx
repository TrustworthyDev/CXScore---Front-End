import {
  ActionIcon,
  Box,
  Divider,
  Group,
  Modal,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ColumnDef, Row } from "@tanstack/react-table";
import React, { useCallback, useContext, useState } from "react";

import { Table, TableExpandProps } from "@/atoms/Table/MantineTable";
import { ScanIcon } from "@/icons/ScanIcon";
import { SnapshotIcon } from "@/icons/Snapshot";
import { PerfRuleType } from "@/types/enum";
import {
  TableExpandCell,
  TableExpandHeader,
} from "~/Sameer/components/page/common/table/expansion";

import { PerfSnapshot } from "./PerfSnapshot";
import PerfViolationsTableContext from "./PerfViolationsTableContext";
import { INPViolation } from "./violationdetails/INPViolation";
import { LCPViolation } from "./violationdetails/LCPViolation";
import { TBTViolation } from "./violationdetails/TBTViolation";

interface Props {
  violations: ApiPerfViolation[];
}
const columns: ColumnDef<ApiPerfViolation>[] = [
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
    cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
  },
  {
    id: "device",
    footer: "Device",
    accessorFn: (row) => row.cpu,
    header: "Device",
    cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
  },
  {
    id: "network",
    footer: "Network",
    accessorFn: (row) => row.network,
    header: "Network",
    cell: ({ getValue }) => <Text size="sm">{getValue<string>()}</Text>,
  },
  {
    id: "distance",
    footer: "Distance",
    accessorFn: (row) => row.distance,
    header: "Distance",
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
  {
    id: "actions",
    footer: "Devtools",
    header: "Devtools",
    cell: ({ row }) => <TableRowActions row={row} />,
  },
];

const initialColumnVisibility = {
  // the other columns
  ...columns.reduce((acc, col) => ({ ...acc, [col.id as string]: false }), {}),
  expand: true,
  actions: true,
  url: true,
  device: true,
  network: true,
  distance: true,
  severity: true,
  actionType: true,
  ruleId: true,
  successCriteriaDescription: true,
};

export const PerfViolationsTable: React.FC<Props> = ({ violations }) => {
  const [modalOpened, modalControl] = useDisclosure(false);
  const [boundingBoxes, setBoundingBoxes] = useState<Rectangle[]>([]);
  const [snapshotUrl, setSnapshotUrl] = useState("");

  const handleOpenSnapshot = useCallback(
    (row: Row<ApiPerfViolation>) => {
      const violation = row.original;
      switch (violation.ruleId) {
        case PerfRuleType.LCP: {
          const detailArr = violation.details.find(
            (v) => v.at(0)?.id === "largest-contentful-paint-element",
          );
          if (
            !detailArr ||
            !detailArr.length ||
            detailArr[0].details?.type !== "list"
          ) {
            return;
          }
          const items = detailArr[0].details.items;

          setBoundingBoxes(
            items
              .flatMap((v) => (v.type === "table" ? v.items : []))
              .filter(
                (v) =>
                  !!v.node &&
                  typeof v.node === "object" &&
                  v.node.type === "node",
              )
              .map((v) =>
                !!v.node && typeof v.node === "object" && v.node.type === "node"
                  ? {
                      x: v.node.boundingRect?.left ?? 0,
                      y: v.node.boundingRect?.top ?? 0,
                      w: v.node.boundingRect?.width ?? 0,
                      h: v.node.boundingRect?.height ?? 0,
                    }
                  : { x: 0, y: 0, w: 0, h: 0 },
              )
              .filter((v) => v.w !== 0),
          );
          break;
        }
        case PerfRuleType.CLS: {
          const detailArr = violation.details.find(
            (v) => v.at(0)?.id === "layout-shift-elements",
          );
          if (!detailArr || !detailArr.length) {
            return;
          }

          setBoundingBoxes(
            detailArr
              .map((v) => v.details)
              .flatMap((v) => (!!v && v.type === "table" ? v.items : []))
              .filter(
                (v) =>
                  !!v.node &&
                  typeof v.node === "object" &&
                  v.node.type === "node" &&
                  Number(v.score) >= 0.05,
              )
              .map((v) =>
                !!v.node && typeof v.node === "object" && v.node.type === "node"
                  ? {
                      x: v.node.boundingRect?.left ?? 0,
                      y: v.node.boundingRect?.top ?? 0,
                      w: v.node.boundingRect?.width ?? 0,
                      h: v.node.boundingRect?.height ?? 0,
                    }
                  : { x: 0, y: 0, w: 0, h: 0 },
              )
              .filter((v) => v.w !== 0),
          );
          break;
        }
        default:
          return;
      }
      setSnapshotUrl(violation.snapshotUrl);
      modalControl.open();
    },
    [modalControl],
  );
  const TableExpandElement = useCallback(
    ({ data }: TableExpandProps<ApiPerfViolation>) => {
      switch (data.ruleId) {
        case "CXS_Performance_TBT":
          return <TBTViolation violation={data} />;
        case "CXS_Performance_LCP":
          return <LCPViolation violation={data} />;
        case "CXS_Performance_INP":
          return <INPViolation violation={data} />;
        default:
          return <Box>No details</Box>;
      }
    },
    [],
  );

  return (
    <PerfViolationsTableContext.Provider
      value={{
        handleOpenSnapshot,
      }}
    >
      <Box>
        <Title order={3}>Violations</Title>
        <Box ml="xl" mt="md">
          {violations.length ? (
            <Table
              data={violations}
              initialColumnVisibility={initialColumnVisibility}
              columns={columns}
              tableName="perfViolations"
              ExpandElement={TableExpandElement}
            />
          ) : (
            <Text>No Violations</Text>
          )}
        </Box>
        <Modal
          opened={modalOpened}
          onClose={modalControl.close}
          size="auto"
          withCloseButton={false}
          centered
        >
          <PerfSnapshot
            boundingBoxes={boundingBoxes}
            snapshotUrl={snapshotUrl}
          />
        </Modal>
      </Box>
    </PerfViolationsTableContext.Provider>
  );
};

const TableRowActions = ({ row }: { row: Row<ApiPerfViolation> }) => {
  const { handleOpenSnapshot } = useContext(PerfViolationsTableContext);
  const handleClickSnapshot = useCallback(() => {
    handleOpenSnapshot(row);
  }, [handleOpenSnapshot, row]);
  return (
    <Group align="center" justify="center" wrap="nowrap" gap="xs">
      <ActionIcon aria-label="Show snapshot" onClick={handleClickSnapshot}>
        <SnapshotIcon className="h-6 w-6" />
      </ActionIcon>
      <Divider orientation="vertical" />
      <ActionIcon aria-label="Re-scan">
        <ScanIcon fill="black" />
      </ActionIcon>
    </Group>
  );
};
