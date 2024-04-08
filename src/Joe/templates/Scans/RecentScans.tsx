import { Box, Group, Text, Title } from "@mantine/core";
import { ColumnDef, ExpandedState } from "@tanstack/react-table";
import React, { useCallback, useMemo, useState } from "react";

import { InfoList } from "@/atoms/InfoList";
import { ScanType } from "@/types/enum";

import { ScansTable } from "./ScansTable";
import { AppSelectionMenu } from "../../../Sameer/components/page/common/header-bar/app-selection-menu";

export type RecentScansProps = {
  scansData: ApiScan[];
};

type ScanInfoByType = {
  scanType: ScanType;
  numberOfScans: number;
};

const initialData: Record<ScanType, number> = {
  [ScanType.SinglePageScan]: 0,
  [ScanType.FullPageScan]: 0,
  [ScanType.MultiPageScan]: 0,
  [ScanType.ViolationReScan]: 0,
};

const scanTypeStr = {
  [ScanType.SinglePageScan]: "Single Page Scan",
  [ScanType.MultiPageScan]: "Multi Page Scan",
  [ScanType.FullPageScan]: "Full App Scan",
  [ScanType.ViolationReScan]: "Violation Re-Scan",
};

export const RecentScans: React.FC<RecentScansProps> = ({ scansData }) => {
  const [expandedState, setExpandedState] = useState<Record<string, boolean>>(
    {},
  );

  const countByScanType = useMemo<ScanInfoByType[]>(
    () =>
      Object.entries(
        scansData.reduce<Record<ScanType, number>>((res, scan) => {
          const scanType = scan.scanType || ScanType.SinglePageScan;
          return {
            ...res,
            [scanType]: (res[scanType] || 0) + 1,
          };
        }, initialData),
      ).map(([scanType, count]) => ({
        scanType: scanType as ScanType,
        numberOfScans: count as number,
      })),
    [scansData],
  );

  const groupedByScanType = useMemo<Record<ScanType, ApiScan[]>>(
    () =>
      scansData.reduce(
        (res, scan) => {
          const scanType = scan.scanType ?? ScanType.SinglePageScan;
          return {
            ...res,
            [scanType]: [...(res[scanType] ?? []), scan],
          };
        },
        {
          [ScanType.SinglePageScan]: [],
          [ScanType.FullPageScan]: [],
          [ScanType.MultiPageScan]: [],
          [ScanType.ViolationReScan]: [],
        },
      ),
    [scansData],
  );

  const handleChangeExpanded = useCallback((state: ExpandedState) => {
    typeof state !== "boolean" && setExpandedState(state);
  }, []);

  const scansListColumns: ColumnDef<ScanInfoByType>[] = [
    {
      id: "scanType_start",
      accessorKey: "scanType",
      cell: (row) => (
        <Text c="primary">{scanTypeStr[row.getValue<ScanType>()]}</Text>
      ),
      sortingFn: "alphanumeric",
      header: "Scan Type",
      footer: "Scan Type",
    },
    {
      id: "numberOfScans",
      accessorKey: "numberOfScans",
      cell: (row) => <span>{row.getValue<string>()}</span>,
      sortingFn: "alphanumeric",
      header: "Number of Scans",
      footer: "Number of Scans",
    },
  ];

  const isNothingExpanded = useMemo(
    () => Object.entries(expandedState).every(([, expanded]) => !expanded),
    [expandedState],
  );

  return (
    <Box>
      <Group>
        <Title order={3}>Recent scans</Title>
        <AppSelectionMenu />
      </Group>
      <Box className="my-8">
        <InfoList
          data={countByScanType}
          columns={scansListColumns}
          SubComponent={({ data }) => (
            <ScansTable
              title={scanTypeStr[data.scanType]}
              scansData={groupedByScanType[data.scanType]}
            />
          )}
          onChangeExpandedRow={handleChangeExpanded}
        />
      </Box>
      {isNothingExpanded && (
        <ScansTable title="Scans Inventory" scansData={scansData} />
      )}
    </Box>
  );
};
