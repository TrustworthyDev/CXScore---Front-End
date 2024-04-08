import { Group, Text, rem } from "@mantine/core";
import React from "react";

import { getLimitType, limitColors } from "../consts";

type Props = {
  metric?: PerfMetric;
};

export const AppScoreCard: React.FC<Props> = ({ metric }) => {
  if (!metric) {
    return <Text>|</Text>;
  }
  return (
    <Group
      justify="space-between"
      px="lg"
      py="xs"
      style={{
        borderRadius: rem(2000),
        boxShadow: "var(--mantine-shadow-md)",
        backgroundColor: limitColors[getLimitType(metric)],
      }}
      className="rounded"
    >
      <Text
        c="white"
        fw="bold"
      >{`${(metric?.value[0] ?? 0).toFixed(2)} ${metric?.metricUnit}`}</Text>
      <Text ml="xl" c="white" size="xs">
        {metric?.metricType}
      </Text>
    </Group>
  );
};

// const boxRadiusStyle: MantineStyleProp = {
//   borderTopLeftRadius: "var(--mantine-radius-md)",
//   borderBottomLeftRadius: "var(--mantine-radius-md)",
//   height: "100%",
// };
