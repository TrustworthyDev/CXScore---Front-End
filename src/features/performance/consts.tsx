import { PerfLimitType, PerfMetricType } from "@/types/enum";

export const limitColors: Record<PerfLimitType, string> = {
  low: "var(--mantine-color-teal-7)",
  medium: "var(--mantine-color-yellow-7)",
  high: "var(--mantine-color-red-7)",
};
export const limitRawColors: Record<PerfLimitType, string> = {
  low: "#0ca678",
  medium: "#f59f00",
  high: "#f03e3e",
};

export const getScoreLabel = (score: number) => {
  if (score < 34) {
    return "Bad";
  } else if (score < 67) {
    return "Average";
  }
  return "Good";
};

export const getLimitType = (metric: PerfMetric): PerfLimitType => {
  let reverse = false;
  if (metric.metricType === PerfMetricType.PS) {
    reverse = true;
  }
  if (metric.value[0] < metric.limitProp.low) {
    return reverse ? PerfLimitType.high : PerfLimitType.low;
  } else if (metric.value[0] < metric.limitProp.medium) {
    return PerfLimitType.medium;
  }
  return reverse ? PerfLimitType.low : PerfLimitType.high;
};

export const perfMetricDescription: Record<PerfMetricType, string> = {
  [PerfMetricType.PS]: "Performance Score",
  [PerfMetricType.FCP]: "First Contentful Paint",
  [PerfMetricType.LCP]: "Largest Contentful Paint",
  [PerfMetricType.CLS]: "Cumulative Layout Shift",
  [PerfMetricType.TBT]: "Total Blocking Time",
  [PerfMetricType.SI]: "Speed Index",
  [PerfMetricType.INP]: "Interaction to Next Paint",
  [PerfMetricType.TTFB]: "Time to First Byte",
};
