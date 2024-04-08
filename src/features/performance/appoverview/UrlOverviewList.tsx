import {
  ActionIcon,
  Box,
  Group,
  List,
  Paper,
  ScrollArea,
  Text,
  rem,
} from "@mantine/core";
import React, { useContext, useMemo } from "react";
import {
  AiOutlineInfoCircle,
  AiOutlineLink,
  AiOutlineSearch,
} from "react-icons/ai";
import { Link } from "react-router-dom";

import { PerfMetricType } from "@/types/enum";

import { getScoreLabel } from "../consts";
import PerformanceContext from "../PerformanceContext";

interface Props {
  urlPerfDetailList: ApiUrlPerfDetail[];
}

export const UrlOverviewList: React.FC<Props> = ({ urlPerfDetailList }) => {
  return (
    <Box>
      <Group justify="space-between" mb="xl">
        <Text>Page scanned</Text>
        <Text>{urlPerfDetailList.length}</Text>
      </Group>

      <ScrollArea mah={rem(200)}>
        <List
          styles={{
            itemWrapper: { width: "100%" },
            itemLabel: { width: "100%" },
          }}
        >
          {urlPerfDetailList.map((perf) => (
            <List.Item key={perf.url}>
              <UrlOverviewItem urlPerfDetail={perf} />
            </List.Item>
          ))}
        </List>
      </ScrollArea>
    </Box>
  );
};

type UrlOverviewItemProps = {
  urlPerfDetail: ApiUrlPerfDetail;
};

const scoreColors = {
  Good: "var(--mantine-color-teal-7)",
  Average: "var(--mantine-color-yellow-7)",
  Bad: "var(--mantine-color-red-7)",
};
const UrlOverviewItem: React.FC<UrlOverviewItemProps> = ({ urlPerfDetail }) => {
  const { isMobile } = useContext(PerformanceContext);
  const score = useMemo(
    () =>
      (urlPerfDetail.perfScanDetail.perfScanMetrics[
        isMobile ? "mobile" : "desktop"
      ].find((v) => v.metricType === PerfMetricType.PS)?.value[0] ?? 0) * 100,
    [isMobile, urlPerfDetail.perfScanDetail.perfScanMetrics],
  );
  return (
    <Group justify="space-between" mb="lg">
      <Paper
        shadow="lg"
        pr="xl"
        style={{ borderRadius: "var(--mantine-radius-max)", flex: 1 }}
      >
        <Group>
          <Group style={{ flex: 5 }}>
            <ActionIcon
              variant="subtle"
              style={{
                boxShadow: "var(--mantine-shadow-xl)",
                borderRadius: "var(--mantine-radius-max)",
                height: rem(40),
                width: rem(50),
              }}
            >
              <AiOutlineLink />
            </ActionIcon>
            <Link to={`/performance/url/${urlPerfDetail.scanId}`}>
              <Text c="primary" td="underline">
                {urlPerfDetail.url}
              </Text>
            </Link>
          </Group>
          <Group style={{ flex: 2 }}>
            <Box
              style={{
                width: rem(16),
                height: rem(16),
                backgroundColor: scoreColors[getScoreLabel(score)],
                borderRadius: "50%",
              }}
            />
            <Text>{getScoreLabel(score)}</Text>
          </Group>
          <Group style={{ flex: 3 }}>
            <AiOutlineInfoCircle />
            <Text>Last Scanned: 2nd Feb 2024</Text>
          </Group>
        </Group>
      </Paper>
      <ActionIcon
        variant="subtle"
        style={{
          boxShadow: "var(--mantine-shadow-xl)",
          borderRadius: "50%",
          width: rem(40),
          height: rem(40),
        }}
      >
        <AiOutlineSearch />
      </ActionIcon>
    </Group>
  );
};
