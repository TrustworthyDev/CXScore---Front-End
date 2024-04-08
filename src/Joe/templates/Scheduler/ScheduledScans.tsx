import { Text } from "@mantine/core";
import { ColumnDef } from "@tanstack/react-table";
import React, { useMemo } from "react";

import { Box } from "@/atoms/Box";
import { InfoList } from "@/atoms/InfoList";
import { SchedulerFrequency } from "@/types/enum";

import { ScheduledScansTable } from "./ScheduledScansTable";

export type RecentScansProps = {
  schedulerDetail: ApiScheduler[];
};

type ScheduledScanInfoByFrequency = {
  frequencyType: SchedulerFrequency;
  numberOfScans: number;
};

const initialData: Record<SchedulerFrequency, number> = {
  [SchedulerFrequency.Daily]: 0,
  [SchedulerFrequency.Weekly]: 0,
  [SchedulerFrequency.Monthly]: 0,
  [SchedulerFrequency.Quarterly]: 0,
};

const frequencyTypeStr = {
  [SchedulerFrequency.Daily]: "Daily",
  [SchedulerFrequency.Weekly]: "Weekly",
  [SchedulerFrequency.Monthly]: "Monthly",
  [SchedulerFrequency.Quarterly]: "Quarterly",
};

export const ScheduledScans: React.FC<RecentScansProps> = ({
  schedulerDetail,
}) => {
  const countByFrequency = useMemo<ScheduledScanInfoByFrequency[]>(
    () =>
      Object.entries(
        schedulerDetail.reduce<Record<SchedulerFrequency, number>>(
          (res, scheduler) => {
            const frequencyType =
              scheduler.frequency || SchedulerFrequency.Daily;
            if (typeof res[frequencyType] === "undefined") {
              return res;
            }
            return {
              ...res,
              [frequencyType]:
                res[frequencyType] + (scheduler.scan?.length || 0),
            };
          },
          initialData,
        ),
      ).map(([frequencyType, count]) => ({
        frequencyType: frequencyType as SchedulerFrequency,
        numberOfScans: count as number,
      })),
    [schedulerDetail],
  );

  const groupedByFrequencyType = useMemo<Record<SchedulerFrequency, ApiScan[]>>(
    () =>
      schedulerDetail.reduce(
        (res, scheduler) => {
          const frequencyType = scheduler.frequency || SchedulerFrequency.Daily;
          if (typeof res[frequencyType] === "undefined") {
            return res;
          }
          return {
            ...res,
            [frequencyType]: [
              ...(res[frequencyType] ?? []),
              ...(scheduler.scan || []),
            ],
          };
        },
        {
          [SchedulerFrequency.Daily]: [],
          [SchedulerFrequency.Weekly]: [],
          [SchedulerFrequency.Monthly]: [],
          [SchedulerFrequency.Quarterly]: [],
        },
      ),
    [schedulerDetail],
  );

  const scansListColumns: ColumnDef<ScheduledScanInfoByFrequency>[] = [
    {
      id: "frequencyType_start",
      accessorKey: "frequencyType",
      cell: (row) => (
        <Text c="primary">
          {frequencyTypeStr[row.getValue<SchedulerFrequency>()]}
        </Text>
      ),
      header: "Scan Frequency",
      footer: "Scan Frequency",
    },
    {
      id: "numberOfScans",
      accessorKey: "numberOfScans",
      cell: (row) => <Text>{row.getValue<string>()}</Text>,
      sortingFn: "alphanumeric",
      header: "Number of Scans",
      footer: "Number of Scans",
    },
  ];

  return (
    <Box className="my-8">
      <InfoList
        data={countByFrequency}
        columns={scansListColumns}
        SubComponent={({ data }) => (
          <ScheduledScansTable
            title={"Scans Inventory"}
            scansData={groupedByFrequencyType[data.frequencyType]}
          />
        )}
      />
    </Box>
  );
};
