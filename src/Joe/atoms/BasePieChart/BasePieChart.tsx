import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, PieLabel } from "recharts";

const gradientColors = {
  BLUE: { start: "#2AFADF", end: "#4C83FF" },
  YELLOW: { start: "#FACA4F", end: "#FF784E" },
};

export type ChartEntry = {
  label: string;
  value: number;
};

export type ChartFillColor = {
  isGradient: boolean;
  colorID: string;
};

export type PieConfig = {
  startAngle?: number;
  endAngle?: number;
};

export type PieChartCardProps = {
  title?: string;
  chartData: ChartEntry[];
  colorConfig: ChartFillColor[];
  pieConfig?: PieConfig;
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel: PieLabel<any> = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  label,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
    >
      {label}
    </text>
  );
};

export const BasePieChart: React.FC<PieChartCardProps> = ({
  chartData,
  colorConfig,
  pieConfig,
}) => {
  return (
    <ResponsiveContainer width={"99%"} aspect={1}>
      <PieChart>
        <defs>
          {colorConfig.map(({ colorID }, index) => (
            <linearGradient id={`myGradient${index}`} key={`key-${colorID}`}>
              <stop
                offset="0%"
                stopColor={
                  gradientColors[colorID as keyof typeof gradientColors].start
                }
              />
              <stop
                offset="100%"
                stopColor={
                  gradientColors[colorID as keyof typeof gradientColors].end
                }
              />
            </linearGradient>
          ))}
        </defs>
        <Pie
          data={chartData}
          dataKey="value"
          label={renderCustomizedLabel}
          labelLine={false}
          {...pieConfig}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                colorConfig[index].isGradient
                  ? `url(#myGradient${index})`
                  : colorConfig[index].colorID
              }
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};
