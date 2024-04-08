import { Box, Grid, Group, rem, Select, Text, Title } from "@mantine/core";
import React, { useCallback, useContext, useState } from "react";

import {
  DeviceType,
  PerfDeviceType,
  PerfLocationType,
  PerfMetricType,
  PerfNetworkType,
} from "@/types/enum";
import { HeatMap } from "~/features/shared/charts/HeatMap";

import { getLimitType, limitRawColors, perfMetricDescription } from "../consts";
import PerformanceContext from "../PerformanceContext";

interface Props {
  scanDetail: ApiPerfScan;
  isRapidScan?: boolean;
}

const compareMetrics = [
  PerfMetricType.PS,
  PerfMetricType.CLS,
  PerfMetricType.FCP,
  PerfMetricType.LCP,
  PerfMetricType.TBT,
  PerfMetricType.SI,
].map((v) => ({ label: `${v} (${perfMetricDescription[v]})`, value: v }));

const networkLabels: Record<PerfNetworkType, string> = {
  [PerfNetworkType.LOW]: "3G",
  [PerfNetworkType.MEDIUM]: "LTE",
  [PerfNetworkType.HIGH]: "WiFi",
};

export const SensitivityAnalysis: React.FC<Props> = ({
  scanDetail,
  isRapidScan,
}) => {
  const { isMobile } = useContext(PerformanceContext);
  const [metricType, setMetricType] = useState<PerfMetricType>(
    PerfMetricType.PS,
  );

  // console.log("Hello", fixedScanDetail);

  const handleChangeMetricType = useCallback((v: string | null) => {
    setMetricType(v ? (v as PerfMetricType) : PerfMetricType.PS);
  }, []);

  if (isRapidScan) {
    return (
      <Box mb="lg">
        <Title order={3} mb="md">
          Sensitivity Analysis
        </Title>
        <Text ml="md">
          You need to submit deep scan for sensitivity analysis.
        </Text>
      </Box>
    );
  }

  return (
    <Box mb="lg">
      <Title order={3}>Sensitivity Analysis</Title>
      <Box ml="md">
        <Group mb="lg" mt="xl">
          {/* <Text>Compare metric type</Text> */}
          <Select
            styles={{
              root: {
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "var(--mantine-spacing-md)",
              },
              input: {
                width: rem(250),
              },
            }}
            label="Select metric type"
            data={compareMetrics}
            defaultValue={PerfMetricType.PS}
            value={metricType}
            onChange={handleChangeMetricType}
          />
        </Group>
        <Grid columns={3} gutter={0}>
          {Object.values(PerfDeviceType)
            .filter((v) => isMobile || v !== PerfDeviceType.MID_TIER)
            .map((deviceType) => (
              <Grid.Col key={deviceType} span={1}>
                <SensitivityPerMetric
                  scanDetail={scanDetail}
                  deviceType={deviceType}
                  metricType={metricType}
                />
              </Grid.Col>
            ))}
        </Grid>
      </Box>
    </Box>
  );
};

type SensitivityPerMetricProps = {
  deviceType: PerfDeviceType;
  metricType: PerfMetricType;
  scanDetail: ApiPerfScan;
};
const SensitivityPerMetric: React.FC<SensitivityPerMetricProps> = ({
  deviceType,
  metricType,
  scanDetail,
}) => {
  const { isMobile } = useContext(PerformanceContext);
  const metrics =
    scanDetail.perfScanMetrics[
      isMobile ? DeviceType.MOBILE : DeviceType.DESKTOP
    ];

  const getXPropString = useCallback(
    (x: PerfNetworkType) => networkLabels[x],
    [],
  );
  const getYPropString = useCallback((y: PerfLocationType) => y, []);
  const getRowStyleAndText = useCallback(
    (data: PerfDeviceMetrics[], x: PerfNetworkType, y: PerfLocationType) => {
      const deviceMetric = data.find(
        (deviceMetric) =>
          deviceMetric.deviceConfig.location === y &&
          deviceMetric.deviceConfig.network === x &&
          deviceMetric.deviceConfig.device === deviceType,
      );
      const perfScanMetrics = deviceMetric?.perfScanMetrics.find((v) => !!v);
      if (perfScanMetrics) {
        return {
          color: limitRawColors[getLimitType(perfScanMetrics[metricType])],
          text:
            metricType === PerfMetricType.PS
              ? `${(perfScanMetrics[metricType].value[0] * 100).toFixed(0)}%`
              : String(perfScanMetrics[metricType].value[0].toFixed(2)),
          key: `${x}-${y}`,
        };
      }
      return {
        color: "white",
        text: "",
        key: `${x}-${y}`,
      };
    },
    [deviceType, metricType],
  );
  return (
    <HeatMap
      data={metrics}
      xProps={Object.values(PerfNetworkType)}
      yProps={Object.values(PerfLocationType)}
      getXPropString={getXPropString}
      getYPropString={getYPropString}
      getRowStyleAndText={getRowStyleAndText}
      title={`${deviceType} Device`}
      xTitle="Network"
      yTitle="Location"
    />
  );
};
