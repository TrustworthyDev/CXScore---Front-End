import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CurveType } from "recharts/types/shape/Curve";
import { Box } from "../Box";
import clsx from "clsx";

export type LineConfig = {
  dataKey: string;
  color: string;
};

export type BaseLineChartProps = {
  chartConfig: LineConfig[];
  chartData: any[];
  lineWidth?: number;
  lineType?: CurveType;
  className?: string;
};

export const BaseLineChart: React.FC<BaseLineChartProps> = ({
  chartConfig,
  chartData,
  lineType = "monotone",
  lineWidth = 4,
  className,
}) => {
  return (
    <Box flex className={clsx("items-center justify-center", className)}>
      <ResponsiveContainer width="100%" aspect={3}>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="top" align="left" iconType="square" />
          {chartConfig.map((config) => (
            <Line
              key={`key-linechart-${config.dataKey}`}
              type={lineType}
              dataKey={config.dataKey}
              stroke={config.color}
              strokeWidth={lineWidth}
              dot={{ fill: config.color, strokeWidth: 0, r: lineWidth + 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};
