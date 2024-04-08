import {
  BarElement,
  CategoryScale,
  Chart,
  ChartDataset,
  ChartMeta,
  LinearScale,
  Plugin,
} from "chart.js";
import {
  MatrixController,
  MatrixDataPoint,
  MatrixElement,
} from "chartjs-chart-matrix";

import { MatrixData } from "./HeatMap";

const angleToRadian = (angle: number) => {
  return (angle / 180) * Math.PI;
};

const matrixText: Plugin<"matrix"> = {
  id: "matrixText",
  afterDatasetDraw: (chart) => {
    const ctx = chart.ctx;
    const {
      chartArea: { left, top, right, bottom },
      scales: { x, y },
    } = chart;
    const xLen = x.getLabels().length;
    const yLen = y.getLabels().length;
    const cellWidth = (right - left) / xLen;
    const cellHeight = (bottom - top) / yLen;

    const dataset = chart.data.datasets[0];
    const data = dataset.data as MatrixDataPoint[];
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white"; // Set text color
    ctx.font = `bold 14px sans-serif`;

    // Loop through each data point to draw text
    for (let i = 0; i < xLen; i++) {
      for (let j = 0; j < yLen; j++) {
        const value = data[i * yLen + j] as unknown as MatrixData;
        const x = left + cellWidth * (i + 0.5);
        const y = top + cellHeight * (j + 0.5);
        ctx.fillText(`${value.v.text as string}`, x, y);
      }
    }
    ctx.textBaseline = "top";
    ctx.fillStyle = "black";
    ctx.font = `20px sans-serif`;
    ctx.fillText(dataset.label || "", (right - left) / 2 + left, 0);
    ctx.restore();
  },
};

const gaugeNeedle: Plugin<"doughnut"> = {
  id: "gaugeNeedle",
  afterDatasetDraw(chart: Chart<"doughnut">, args, options) {
    if (!chart || typeof options.needleValue === "undefined") {
      return;
    }
    const {
      ctx,
      chartArea: { width },
    } = chart;
    const datasetMeta: ChartMeta<"doughnut"> = chart.getDatasetMeta(0);
    const { rotation, circumference } =
      datasetMeta.controller.getDataset() as ChartDataset<"doughnut">;
    ctx.save();
    const { needleValue, dataTotal } = options;
    const angle =
      (((1 / dataTotal) * needleValue * (circumference || 0) -
        (90 - (rotation || 0))) /
        180) *
      Math.PI;
    const cx = width / 2;
    const cy = datasetMeta.data[0].y;

    // needle value
    ctx.font = `${(cx * options.valuePercentage).toFixed(0)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(needleValue.toString(), cx, cy);

    // needle
    ctx.translate(cx, cy);

    ctx.strokeStyle = "#aaa";
    ctx.setLineDash([3, 1]);
    ctx.beginPath();
    ctx.arc(
      0,
      0,
      cx * options.needleOffsetPercentage + 10,
      0,
      angleToRadian(360),
    );
    ctx.stroke();

    const rx1 = cx * options.needleOffsetPercentage + 20;
    const rx2 = cx - 20;
    const mangle = 2;
    ctx.beginPath();
    ctx.arc(
      0,
      0,
      rx1,
      angleToRadian(-210 - mangle),
      angleToRadian(30 + mangle),
    );
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(
      0,
      0,
      rx2,
      angleToRadian(-210 - mangle),
      angleToRadian(30 + mangle),
    );
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(
      rx1 * Math.cos(angleToRadian(-210 - mangle)),
      rx1 * Math.sin(angleToRadian(-210 - mangle)),
    );
    ctx.lineTo(
      rx2 * Math.cos(angleToRadian(-210 - mangle)),
      rx2 * Math.sin(angleToRadian(-210 - mangle)),
    );
    ctx.moveTo(
      rx1 * Math.cos(angleToRadian(30 + mangle)),
      rx1 * Math.sin(angleToRadian(30 + mangle)),
    );
    ctx.lineTo(
      rx2 * Math.cos(angleToRadian(30 + mangle)),
      rx2 * Math.sin(angleToRadian(30 + mangle)),
    );
    ctx.stroke();

    ctx.strokeStyle = "#444";
    ctx.setLineDash([0]);
    ctx.beginPath();
    const marginRuler = 5;
    for (let i = 0; i <= 20; i++) {
      let len = 6;
      const angle = -210 + i * 12;
      if (i % 5 === 0) {
        len = 12;
      }
      ctx.moveTo(
        (rx2 - marginRuler) * Math.cos(angleToRadian(angle)),
        (rx2 - marginRuler) * Math.sin(angleToRadian(angle)),
      );
      ctx.lineTo(
        (rx2 - marginRuler - len) * Math.cos(angleToRadian(angle)),
        (rx2 - marginRuler - len) * Math.sin(angleToRadian(angle)),
      );
    }
    ctx.stroke();

    ctx.font = `${(15).toFixed(0)}px sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(
      "0",
      rx2 * Math.cos(angleToRadian(-210 - mangle - 2)),
      rx2 * Math.sin(angleToRadian(-210 - mangle - 2)),
    );

    ctx.textAlign = "right";
    ctx.fillText(
      "100",
      rx2 * Math.cos(angleToRadian(30 + mangle + 2)),
      rx2 * Math.sin(angleToRadian(30 + mangle + 2)),
    );

    const needleR = 3;
    ctx.rotate(angle);
    ctx.translate(cx * options.needleOffsetPercentage, 0);
    ctx.beginPath();
    ctx.moveTo(0, -needleR);
    ctx.lineTo(cx * options.needlePercentage, 0);
    ctx.lineTo(0, needleR);
    ctx.fillStyle = "#444";
    ctx.fill();

    // needle dot
    ctx.beginPath();
    ctx.arc(0, 0, needleR, 0, angleToRadian(360));
    ctx.fill();

    ctx.restore();
  },
};
export const initChartsConfigs = () => {
  Chart.register(
    gaugeNeedle,
    matrixText,
    CategoryScale,
    LinearScale,
    BarElement,
    MatrixController,
    MatrixElement,
  );
};
