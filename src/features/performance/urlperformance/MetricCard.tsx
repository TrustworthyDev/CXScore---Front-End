import { Box, Group, Paper, rem, Text, Title, TitleOrder } from "@mantine/core";
import { useMemo } from "react";

import { PerfLimitType } from "@/types/enum";

const barColors: Record<PerfLimitType, string> = {
  low: "var(--mantine-color-teal-7)",
  medium: "var(--mantine-color-yellow-7)",
  high: "var(--mantine-color-red-7)",
};

type SizeType = "sm" | "md";
type Props = {
  metric: PerfMetric;
  size?: SizeType;
};
const sizeProps = {
  sm: {
    barHeight: 6,
    indicatorSize: 10,
    scoreTitleOrder: 4 as TitleOrder,
  },
  md: {
    barHeight: 10,
    indicatorSize: 14,
    scoreTitleOrder: 3 as TitleOrder,
  },
};

export const MetricCard: React.FC<Props> = ({ metric, size = "md" }) => {
  const curLimit = useMemo(() => {
    if (typeof metric.value === "undefined") {
      return PerfLimitType.low;
    }
    if (metric.value[0] < metric.limitProp.low) {
      return PerfLimitType.low;
    } else if (metric.value[0] < metric.limitProp.medium) {
      return PerfLimitType.medium;
    }
    return PerfLimitType.high;
  }, [metric]);
  const barElements = useMemo(() => {
    let unit,
      dif,
      indicatorPos = "start";
    if (typeof metric.value !== "undefined") {
      switch (curLimit) {
        case PerfLimitType.low:
          unit = metric.limitProp[PerfLimitType.low] / 3;
          dif = metric.value[0];
          break;
        case PerfLimitType.medium:
          unit =
            (metric.limitProp[PerfLimitType.medium] -
              metric.limitProp[PerfLimitType.low]) /
            3;
          dif = metric.value[0] - metric.limitProp[PerfLimitType.low];
          break;
        default:
          unit =
            (metric.limitProp[PerfLimitType.high] -
              metric.limitProp[PerfLimitType.medium]) /
            3;
          dif = metric.value[0] - metric.limitProp[PerfLimitType.medium];
      }
      indicatorPos = dif < unit ? "start" : dif < unit * 2 ? "center" : "end";
    }
    return Object.keys(barColors).map((limitType) => (
      <Group
        key={limitType}
        style={{
          borderRadius: 10,
          background: barColors[limitType as PerfLimitType],
          flex: 1,
          height: "100%",
          position: "relative",
          justifyContent: indicatorPos,
          padding: `0 ${metric.value?.at(0) ? rem(9) : 0}`,
        }}
      >
        {curLimit === (limitType as PerfLimitType) && (
          <Box
            style={{
              position: "absolute",
              borderRadius: "100%",
              border: "1px solid #646464",
              background: "white",
              height: rem(sizeProps[size].indicatorSize),
              width: rem(sizeProps[size].indicatorSize),
            }}
          />
        )}
      </Group>
    ));
  }, [curLimit, metric, size]);
  return (
    <Paper px="lg" py="md" shadow="md" w="100%" radius="lg">
      <Group justify="space-between">
        <Text
          size={size}
        >{`${metric.metricType} (${metric.metricDescription || ""})`}</Text>
        <Title c={barColors[curLimit]} order={sizeProps[size].scoreTitleOrder}>
          {metric.value ? metric.value[0] + " " + metric.metricUnit : "0.00"}
        </Title>
      </Group>
      <Box mt="md">
        <Group h={rem(sizeProps[size].barHeight)} gap="xs">
          {barElements}
        </Group>
        <Group justify="space-between" gap={0}>
          <Text></Text>
          <Text size="xs">{metric.limitProp?.low}</Text>
          <Text size="xs">{metric.limitProp?.medium}</Text>
          <Text></Text>
        </Group>
      </Box>
    </Paper>
  );
};
