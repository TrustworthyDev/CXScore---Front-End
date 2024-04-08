import { Box, Image } from "@mantine/core";
import { Chart, ChartData, ChartOptions, ScriptableContext } from "chart.js";
import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";

import images from "~/assets";

type Props = {
  value: number;
};

export const SpeedoMeter: React.FC<Props> = ({ value }) => {
  const data = useMemo<ChartData<"doughnut", number[], string>>(
    () => ({
      labels: ["Filled", "Unfilled"],
      datasets: [
        {
          label: "Speedometer",
          data: [value, 100 - value], // Example data: 65% filled, 35% unfilled
          borderWidth: 0,
          borderRadius: 10,
          cutout: "85%", // Adjust for thicker/thinner gauge appearance
          circumference: 240,
          rotation: -120,
          backgroundColor: (context: ScriptableContext<"doughnut">) => {
            const chart = context.chart;
            const { chartArea } = chart;
            if (!chartArea) {
              return undefined;
            }
            if (context.dataIndex === 0) {
              return getGradient(chart, value);
            } else {
              return "grey";
            }
          },
        },
      ],
    }),
    [value],
  );

  //gaugeNeedle block

  const options = useMemo<ChartOptions<"doughnut">>(
    () => ({
      animation: {
        animateRotate: true,
      },
      plugins: {
        gaugeNeedle: {
          needleValue: value.toFixed(0),
          valuePercentage: 0.4,
          needlePercentage: 0.4,
          needleOffsetPercentage: 0.3,
          dataTotal: 100,
        },
        legend: {
          display: false,
        },
      },
    }),
    [value],
  );
  return (
    <Box>
      <Doughnut data={data} options={options} />
      <Image src={images.brandImg} w="50%" mx="auto" />
    </Box>
  );
};

const getGradient = (chart: Chart, value: number) => {
  const {
    ctx,
    chartArea: { left, right },
  } = chart;
  const graidentSegment = ctx.createLinearGradient(left, 0, right, 0);
  graidentSegment.addColorStop(0, "#72EDF2");
  graidentSegment.addColorStop(1, "#5151E5");
  return graidentSegment;
};
