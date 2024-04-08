import { BaseLineChart } from "@/atoms/BaseLineChart";
import { BasePieChart } from "@/atoms/BasePieChart";
import { Box } from "@/atoms/Box";
import { Card } from "@/atoms/Card";
import { Text } from "@/atoms/Text";
import {
  selectGuidedCurrentStatus,
  selectGuidedStatusHistory,
} from "@/reduxStore/scan/guided/guided.reducer";
import clsx from "clsx";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";

export type ManualTestChartProps = {
  className?: string;
};

export const ManualTestChart: React.FC<ManualTestChartProps> = ({
  className,
}) => {
  const currentStatus = useSelector(selectGuidedCurrentStatus);
  const statusHistory = useSelector(selectGuidedStatusHistory);
  const chartData = useMemo(
    () =>
      statusHistory.map((status, ind) => ({
        name: `WEEK ${ind + 1}`,
        Fixed: status.completed,
        Remaining: status.pending,
      })),
    [statusHistory]
  );
  return (
    <Box flex flexDirection="col" className={clsx("w-1/2", className)}>
      <Card variant="half-rounded" className="w-full px-3 py-5">
        <Text className="text-black/70">Manual Test by status</Text>
        <Box className="px-20">
          <BasePieChart
            chartData={[
              { label: "COMPLETED", value: currentStatus?.completed ?? 1 },
              { label: "PENDING", value: currentStatus?.pending ?? 1 },
            ]}
            colorConfig={[
              { isGradient: true, colorID: "BLUE" },
              { isGradient: true, colorID: "YELLOW" },
            ]}
            pieConfig={{ startAngle: -270 }}
          />
        </Box>
      </Card>
      <Card
        variant="half-rounded"
        className="mt-4 flex w-full flex-1 flex-col px-3 py-5"
      >
        <Text className="text-black/70">Manual Test</Text>
        <Box flex className="flex-1 items-center justify-center">
          <BaseLineChart
            chartConfig={[
              { dataKey: "Fixed", color: "#FF784E" },
              { dataKey: "Remaining", color: "#6BBDDC" },
            ]}
            chartData={chartData}
            className="relative w-full flex-grow"
          />
        </Box>
      </Card>
    </Box>
  );
};
