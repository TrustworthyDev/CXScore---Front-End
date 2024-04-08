import { Box, rem, Text } from "@mantine/core";
import { ColumnDef } from "@tanstack/react-table";
import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { Table } from "@/atoms/Table/MantineTable";
import { PerfLimitType, PerfMetricType } from "@/types/enum";

import { getLimitType, limitColors } from "../consts";
import PerformanceContext from "../PerformanceContext";

type Props = {
  urlPerfDetailList: ApiUrlPerfDetail[];
};

type MetricColorBoxProps = {
  metric: (PerfMetric | undefined)[];
};
const MetricColorBox: React.FC<MetricColorBoxProps> = ({ metric }) => {
  const { isMobile } = useContext(PerformanceContext);
  const deviceMetric = isMobile ? metric[0] : metric[1];
  return (
    <Box
      style={{
        width: rem(60),
        height: rem(24),
        margin: "auto",
        backgroundColor: deviceMetric
          ? limitColors[getLimitType(deviceMetric)]
          : limitColors[PerfLimitType.low],
      }}
    />
  );
};

const getMetricColumnDef = (
  metricType: PerfMetricType,
): ColumnDef<ApiUrlPerfDetail> => {
  return {
    id: metricType,
    footer: metricType === PerfMetricType.SI ? "SPEED" : metricType,
    accessorFn: (row) => [
      row.perfScanDetail.perfScanMetrics.mobile.find(
        (v) => v.metricType === metricType,
      ),
      row.perfScanDetail.perfScanMetrics.desktop.find(
        (v) => v.metricType === metricType,
      ),
    ],
    header: metricType === PerfMetricType.SI ? "SPEED" : metricType,
    cell: ({ getValue }) => (
      <MetricColorBox metric={getValue<(PerfMetric | undefined)[]>()} />
    ),
  };
};

const columns: ColumnDef<ApiUrlPerfDetail>[] = [
  {
    id: "scanName",
    footer: "Scan Name",
    accessorFn: (row) => row.url,
    header: "Scan Name",
    cell: ({ getValue, row }) => (
      <Link to={`/performance/url/${row.original.scanId}`}>
        <Text c="primary" td="underline">
          {getValue<string>()}
        </Text>
      </Link>
    ),
  },
  ...[
    PerfMetricType.TTFB,
    PerfMetricType.FCP,
    PerfMetricType.LCP,
    PerfMetricType.TBT,
    PerfMetricType.INP,
    PerfMetricType.CLS,
    PerfMetricType.SI,
  ].map((metricType) => getMetricColumnDef(metricType)),
];

export const UrlOverviewMetricTable: React.FC<Props> = ({
  urlPerfDetailList,
}) => {
  return (
    <Table
      data={urlPerfDetailList}
      columns={columns}
      withQuickSearch={false}
      withColumnVisibility={false}
      withBorder={false}
    />
  );
};
