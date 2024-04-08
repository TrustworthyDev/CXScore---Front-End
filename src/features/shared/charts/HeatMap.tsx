import { Box, rem } from "@mantine/core";
import { ChartData, ChartOptions } from "chart.js";
import { useMemo } from "react";
import { Chart } from "react-chartjs-2";

type MatrixValue = {
  color: string;
  text: string;
  key: string;
};

export type MatrixData = {
  x: string;
  y: string;
  v: MatrixValue;
};
interface Props<TData, TXProp, TYProp> {
  data: TData;
  xProps: TXProp[];
  yProps: TYProp[];
  xTitle?: string;
  yTitle?: string;
  title?: string;
  getXPropString: (xProp: TXProp) => string;
  getYPropString: (yProp: TYProp) => string;
  getRowStyleAndText: (
    data: TData,
    xProp: TXProp,
    yProp: TYProp,
  ) => MatrixValue;
}

export const HeatMap = <TData, TXProp, TYProp>({
  data,
  xProps,
  yProps,
  getXPropString,
  getYPropString,
  getRowStyleAndText,
  xTitle,
  yTitle,
  title,
}: Props<TData, TXProp, TYProp>) => {
  const stringXProps = xProps.map(getXPropString);
  const stringYProps = yProps.map(getYPropString);
  const chartData: ChartData<"matrix", MatrixData[]> = {
    datasets: [
      {
        label: title,
        data: xProps.flatMap((x) =>
          yProps.map((y) => ({
            x: getXPropString(x),
            y: getYPropString(y),
            v: getRowStyleAndText(data, x, y),
          })),
        ),
        backgroundColor(context) {
          const data = context.dataset.data[
            context.dataIndex
          ] as unknown as MatrixData;
          return data.v.color;
        },
        hoverBackgroundColor: "yellow",
        borderWidth: 0,
        width: ({ chart }) => (chart.chartArea || {}).width / xProps.length - 2,
        height: ({ chart }) =>
          (chart.chartArea || {}).height / yProps.length - 2,
      },
    ],
  };

  const chartOptions = useMemo<ChartOptions<"matrix">>(
    () => ({
      layout: {
        padding: {
          top: 25,
        },
      },
      maintainAspectRatio: true,
      aspectRatio: (xProps.length * 2) / yProps.length,
      plugins: {
        // matrixText: {},
        legend: {
          display: false,
        },
        tooltip: {
          // displayColors: false,
          callbacks: {
            title() {
              return "";
            },
            label(context) {
              const v = context.dataset.data[
                context.dataIndex
              ] as unknown as MatrixData;
              return [
                `${v.v.text}`,
                `${xTitle ?? "x"}: ${v.x}`,
                `${yTitle ?? "y"}: ${v.y}`,
              ];
            },
          },
        },
      },
      scales: {
        x: {
          type: "category",
          labels: stringXProps,
          ticks: {
            display: true,
          },
          grid: {
            display: false,
          },
          title: {
            display: !!xTitle,
            font: {
              size: 15,
              weight: "bold",
            },
            text: xTitle,
          },
        },
        y: {
          type: "category",
          labels: stringYProps,
          offset: true,
          reverse: false,
          ticks: {
            display: true,
          },
          grid: {
            display: false,
          },
          title: {
            display: !!yTitle,
            font: {
              size: 15,
              weight: "bold",
            },
            text: yTitle,
          },
        },
      },
    }),
    [stringXProps, stringYProps, xProps.length, xTitle, yProps.length, yTitle],
  );
  return (
    <Box p="lg" w="100%" mah={rem(450)}>
      <Chart type="matrix" data={chartData} options={chartOptions} />
    </Box>
  );
};
