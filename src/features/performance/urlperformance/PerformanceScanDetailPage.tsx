import {
  ActionIcon,
  Box,
  Button,
  Center,
  Grid,
  Group,
  Loader,
  Paper,
  Switch,
  Text,
  Title,
  rem,
} from "@mantine/core";
import React, { useCallback, useContext } from "react";
import {
  AiOutlineInfoCircle,
  AiOutlineLink,
  AiOutlineSearch,
} from "react-icons/ai";
import { useParams } from "react-router-dom";

import {
  usePerfScanDetail,
  usePerfUrlScansDetail,
  usePerfViolations,
} from "@/api/useRequest";
import {
  DeviceType,
  PerfLimitType,
  PerfMetricType,
  ScanSubType,
} from "@/types/enum";
import { HeatMap } from "~/features/shared/charts/HeatMap";

import { MetricCard } from "./MetricCard";
import { PerfScanList } from "./PerfScanList";
import { PerfViolationsTable } from "./perfviolations/PerfViolationsTable";
import { ScoreCard } from "./ScoreCard";
import { SensitivityAnalysis } from "./SensitivityAnalysis";
import { getLimitType, limitRawColors } from "../consts";
import PerformanceContext from "../PerformanceContext";

interface Props {}

const metrics = [
  PerfMetricType.FCP,
  PerfMetricType.CLS,
  PerfMetricType.LCP,
  PerfMetricType.INP,
  PerfMetricType.SI,
  PerfMetricType.TBT,
];

type Params = {
  scanId: string;
};

const compareMetrics = [
  PerfMetricType.FCP,
  PerfMetricType.LCP,
  PerfMetricType.CLS,
  PerfMetricType.TBT,
  PerfMetricType.SI,
  PerfMetricType.PS,
];

export const PerformanceScanDetailPage: React.FC<Props> = () => {
  const { scanId } = useParams<Params>();
  const { data: scanDetail, isLoading } = usePerfScanDetail({
    scanId: scanId ?? "",
  });
  const { data: violations, isLoading: isLoadingViolation } = usePerfViolations(
    { scanId: scanId ?? "" },
  );
  const scanUrl = scanDetail?.scanConfig.scanUrlList?.at(0) || "";
  const appId = scanDetail?.scanConfig.appId?.id || "";
  const appName = scanDetail?.scanConfig.appId?.name || "";
  const scanSubType =
    scanDetail?.scanConfig.scanSubType || ScanSubType.RapidScan;

  const { data: preScanDetailList } = usePerfUrlScansDetail({
    url: scanUrl,
    appId: appName,
  });
  const scanDetailList = preScanDetailList?.slice(0, 10);
  const { isMobile, onChangeDevice } = useContext(PerformanceContext);

  const metricsData = scanDetail?.perfScanMetrics[
    isMobile ? DeviceType.MOBILE : DeviceType.DESKTOP
  ]
    .at(0)
    ?.perfScanMetrics.at(0);

  const handleChangeDevice = useCallback(() => {
    onChangeDevice(!isMobile);
  }, [isMobile, onChangeDevice]);

  if (
    isLoading ||
    isLoadingViolation ||
    !violations ||
    !scanDetail ||
    !scanDetailList
  ) {
    return (
      <Center h="100%">
        <Loader size="lg" />
      </Center>
    );
  }

  if (!metricsData) {
    return (
      <Box p="lg">
        <Group justify="space-between" mb="md">
          <Title order={3} c="primary">
            {appName}
          </Title>
          <Switch
            size="xl"
            onLabel="Mobile"
            offLabel="Desktop"
            checked={isMobile}
            onChange={handleChangeDevice}
          />
        </Group>
        <Center>
          <Text>
            Metrics data doesn&apos;t exist for{" "}
            {isMobile ? "Mobile" : "Desktop"}.
          </Text>
        </Center>
      </Box>
    );
  }
  const xPropsForBBHeatMap = scanDetailList.map(
    (scan, ind) => `Scan${ind + 1}`,
  );

  return (
    <Box p="lg">
      <Group justify="space-between" mb="md">
        <Title order={3} c="primary">
          {appName}
        </Title>
        <Switch
          size="xl"
          onLabel="Mobile"
          offLabel="Desktop"
          checked={isMobile}
          onChange={handleChangeDevice}
        />
      </Group>
      <Group justify="space-between" gap="lg" mb="lg">
        <Group>
          {/* <Paper h={rem(40)} p="md" shadow="md" radius="lg">
            <Image src={images.appLogoImg} my="auto" h="100%" w="auto" />
          </Paper> */}
          <Paper
            shadow="lg"
            pr="xl"
            style={{ borderRadius: "var(--mantine-radius-max)", flex: 1 }}
          >
            <Group>
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
              <Text c="primary" td="underline">
                {scanUrl}
              </Text>
            </Group>
          </Paper>
          <Button leftSection={<AiOutlineSearch />}>Scan now</Button>
          <Group>
            <AiOutlineInfoCircle />
            <Text>Time Scanned: 2nd Feb 2024</Text>
          </Group>
        </Group>
      </Group>
      <Grid columns={8} gutter="lg" mb="xl">
        <Grid.Col span={5}>
          <Title order={3} mb="md">
            Vitals Summary
          </Title>
          <Grid columns={2} gutter="xl">
            <Grid.Col span={1}>
              <Paper
                m="auto"
                px="xl"
                py="md"
                radius="md"
                shadow="md"
                w="fit-content"
              >
                <Title order={4} c="primary">
                  Page Load
                </Title>
              </Paper>
            </Grid.Col>
            <Grid.Col span={1}>
              <Paper
                m="auto"
                px="xl"
                py="md"
                radius="md"
                shadow="md"
                w="fit-content"
              >
                <Title order={4} c="primary">
                  Interactions
                </Title>
              </Paper>
            </Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col span={5}>
          <Grid columns={2}>
            {metrics.map((metric) => (
              <React.Fragment key={metric}>
                <Grid.Col span={1}>
                  <MetricCard
                    metric={metricsData[metric] ?? { metricType: metric }}
                  />
                </Grid.Col>
              </React.Fragment>
            ))}
          </Grid>
        </Grid.Col>
        <Grid.Col span={3}>
          <ScoreCard
            title={isMobile ? "Mobile Score" : "Desktop Score"}
            score={metricsData[PerfMetricType.PS].value[0]}
          />
          <Box mt="xl" ml="md">
            <Title order={5}>Scans History</Title>
            <PerfScanList
              url={scanDetail.scanConfig.scanUrlList?.at(0) || ""}
              appId={appId}
            />
          </Box>
        </Grid.Col>
      </Grid>

      <SensitivityAnalysis
        scanDetail={scanDetail}
        isRapidScan={scanSubType == ScanSubType.RapidScan}
      />
      <>
        <Title order={3} mb="md">
          Build-over-Build
        </Title>
        {scanDetailList.length > 0 ? (
          <Box ml="md" mb="lg">
            <HeatMap
              data={scanDetailList}
              xProps={xPropsForBBHeatMap}
              yProps={compareMetrics}
              getXPropString={(xProp) => xProp}
              getYPropString={(yProp) => yProp}
              getRowStyleAndText={(data, xProp, yProp) => {
                const ind = xPropsForBBHeatMap.indexOf(xProp);
                const metric = data[ind].perfScanMetrics[
                  isMobile ? DeviceType.MOBILE : DeviceType.DESKTOP
                ]?.find((m) => m.metricType === yProp);
                const value = metric?.value[0] || 0;
                return {
                  color:
                    limitRawColors[
                      metric ? getLimitType(metric) : PerfLimitType.low
                    ],
                  text: value.toFixed(2),
                  key: `${xProp}-${yProp}`,
                };
              }}
              xTitle="Build versions"
              yTitle="Metrics"
            />
          </Box>
        ) : (
          <Text ml="md" mb="lg">
            No data available for comparison.
          </Text>
        )}
      </>
      <PerfViolationsTable violations={violations} />
    </Box>
  );
};
