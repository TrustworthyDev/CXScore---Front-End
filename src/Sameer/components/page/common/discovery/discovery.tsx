import { Box } from "@mantine/core";
import clsx from "clsx";
import React, {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";

import { WarningIcon } from "@/icons/Warning";
import {
  selectApplicationInfo,
  selectSelectedScan,
} from "@/reduxStore/app/app.reducer";
import images from "~/assets";

import { formatNumber } from "../../../../../Suraj/utils/utils";
import { useSelectedAppId } from "../../../../lib/application/use-application-data";
import {
  useDiscoveryByScanId,
  useHealthScoreByScanId,
} from "../../../../lib/application/use-discovery";
import { useViolations } from "../../../../lib/violations/query";
import { SmallSpinner } from "../../../atoms/loading";
import { Paper } from "../../../atoms/paper";

interface DiscoveryCardProps {
  title: string | ReactNode;
  titleDivProps?: React.HTMLAttributes<HTMLDivElement>;
  className?: string;
  isLoading?: boolean;
  screenReaderLabel: string;
}

export const DiscoveryCard = ({
  ...props
}: PropsWithChildren<DiscoveryCardProps>) => {
  return (
    <div
      className={clsx(
        "print-border flex flex-col-reverse bg-white shadow-lg",
        props.className,
      )}
    >
      <div className="sr-only">{props.screenReaderLabel}</div>
      <Box
        role="presentation"
        {...props.titleDivProps}
        bg="primary"
        className={clsx(
          "py-2 text-center font-body text-lg font-semibold text-white",
          props.titleDivProps?.className ? props.titleDivProps.className : "",
        )}
      >
        {props.title}
      </Box>
      <div
        role="presentation"
        className="min-h-[100px] w-full flex-1 font-body"
      >
        {!props.isLoading ? (
          props.children
        ) : (
          <div className="flex h-[100px] items-center justify-center">
            <SmallSpinner className="!mr-0 !ml-0 !h-10 !w-10" />
          </div>
        )}
      </div>
    </div>
  );
};

export const DiscoveryNumberCard = (
  props: PropsWithChildren<{ number: number } & DiscoveryCardProps>,
) => {
  return (
    <DiscoveryCard {...props}>
      <Box
        className="print-border flex h-full items-center justify-center text-4xl font-semibold "
        style={{
          color: "var(--mantine-color-primary-5)",
        }}
      >
        {formatNumber(props.number)}
      </Box>
    </DiscoveryCard>
  );
};

export const HealthScoreCard = ({
  scanId,
  ...props
}: { scanId: string } & React.HTMLAttributes<HTMLDivElement>) => {
  const [healthPercentage, setHealthPercentage] = useState<string>("0");
  const healthScoreResult = useHealthScoreByScanId({
    scanId,
  });
  const selectedAppId = useSelectedAppId();
  useEffect(() => {
    if (
      [
        "c4647879-4636-4359-84d5-58cb7bf73f3d",
        "211e471c-fc0f-492f-9152-ea6dc23399eb",
      ].includes(scanId) &&
      selectedAppId === "UserTesting-POC-Agent"
    ) {
      setHealthPercentage("52");
    } else if (healthScoreResult.data?.passRate?.passRate) {
      setHealthPercentage(
        (healthScoreResult.data?.passRate?.passRate * 100).toFixed(0),
      );
    } else {
      setHealthPercentage("0");
    }
  }, [healthScoreResult.data, scanId, selectedAppId]);

  const transformHealthScore = (healthPercentage: number) => ({
    color:
      healthPercentage < 50
        ? "#F86F80"
        : healthPercentage < 80
          ? "#FCAB31"
          : "#00962A",
    text:
      healthPercentage < 50
        ? "Poor"
        : healthPercentage < 80
          ? "Average"
          : "Good",
  });

  return (
    <DiscoveryCard
      screenReaderLabel={`Overall Health Score: ${Number(healthPercentage)}% (${
        transformHealthScore(Number(healthPercentage)).text
      })`}
      titleDivProps={
        healthScoreResult.isLoading
          ? {}
          : {
              style: {
                backgroundColor: transformHealthScore(Number(healthPercentage))
                  .color,
              },
            }
      }
      title={
        healthScoreResult.isLoading ? (
          "Overall Health Score"
        ) : (
          <div>
            Overall Health Score -{" "}
            {transformHealthScore(Number(healthPercentage)).text}
          </div>
        )
      }
      className="col-span-2"
      isLoading={healthScoreResult.isLoading}
      {...props}
    >
      <div className="relative flex h-[120px] items-center justify-evenly gap-2 px-2 py-2 pb-3">
        <img className="h-[100px]" src={images.heartRateGif} alt="" />
        <div
          className="text-4xl font-semibold"
          style={{
            color: transformHealthScore(Number(healthPercentage)).color,
          }}
        >
          {healthPercentage}%
        </div>
        <div className="absolute bottom-0 right-0 w-full px-2 text-right text-sm">
          [&lt;50% <span className="font-semibold text-[#F86F80]">Poor</span>]
          [50-80%
          <span className="font-semibold text-[#FCAB31]"> Average</span>]
          [&gt;80% <span className="font-semibold text-[#00962A]">Good</span>]
        </div>
      </div>
    </DiscoveryCard>
  );
};

const TotalViolationsCard = ({
  ...props
}: {
  appId: string;
  scanId: string;
}) => {
  const violationsResult = useViolations({
    useHookFlags: {
      useSelectedAppId: true,
      useSelectedScanId: true,
      useSelectedStateIds: false,
      useCheckedFilters: false,
      useWcagFilters: true,
      useDoDeDuplicate: false,
    },
    fieldMatchQueryOpts: {},
    outputOpts: {},
  });

  return (
    <DiscoveryCard
      screenReaderLabel={`Total Violations: ${
        violationsResult.data?.totalCount ?? 0
      }`}
      title="Total Violations"
      className="col-span-2"
      isLoading={violationsResult.isLoading}
      {...props}
    >
      <div className="flex h-[120px] items-center justify-evenly gap-2 px-2 py-2">
        <WarningIcon height={60} width={60} />
        <Box
          style={{ color: "var(--mantine-color-primary-5)" }}
          className="text-4xl font-semibold"
        >
          {formatNumber(violationsResult.data?.totalCount ?? 0)}
        </Box>
      </div>
    </DiscoveryCard>
  );
};

export const SelectedScanDiscovery = ({
  showTotalViolationsHideHealthScore = false,
  ...props
}: {
  queryAllScans: boolean;
  showTotalViolationsHideHealthScore?: boolean; // this option if set will swap health score for total violations
}) => {
  const selectedAppId = useSelector(selectApplicationInfo)?.appId ?? "";
  const selectedScanId = useSelector(selectSelectedScan)?.id ?? "";

  const { data, isLoading, isError } = useDiscoveryByScanId({
    scanId: selectedScanId,
    queryAllScans: props.queryAllScans,
  });

  if (selectedScanId === "" || isError) {
    return null;
  }

  return (
    <Paper>
      <ul className="grid w-full grid-cols-2 gap-4 bg-slate-50 p-4 md:grid-cols-3 lg:grid-cols-6">
        <li className="col-span-2">
          {!showTotalViolationsHideHealthScore ? (
            <HealthScoreCard scanId={selectedScanId} />
          ) : (
            <TotalViolationsCard
              appId={selectedAppId}
              scanId={selectedScanId}
            />
          )}
        </li>
        <li className="col-span-1 h-full">
          <DiscoveryNumberCard
            screenReaderLabel={`Pages Scanned: ${data?.pageScanned ?? 0}`}
            className="h-full"
            title="Pages Scanned"
            number={data?.pageScanned ?? 0}
            isLoading={isLoading}
          />
        </li>
        <li className="col-span-1 h-full">
          <DiscoveryNumberCard
            screenReaderLabel={`Total Elements Scanned: ${
              data?.elementScanned ?? 0
            }`}
            className="h-full"
            title="Elements"
            number={data?.elementScanned ?? 0}
            isLoading={isLoading}
          />
        </li>
        <li className="col-span-1 h-full">
          <DiscoveryNumberCard
            screenReaderLabel={`Total States Scanned: ${
              data?.stateScanned ?? 0
            }`}
            className="h-full"
            title="Visible States"
            number={data?.stateScanned ?? 0}
            isLoading={isLoading}
          />
        </li>
        <li className="col-span-1 h-full">
          <DiscoveryNumberCard
            screenReaderLabel={`Total Scans Run: ${data?.scansRun ?? 1}`}
            className="h-full"
            title={props.queryAllScans ? "Scans Run" : "Full App Scans"}
            number={data?.scansRun ?? 1}
            isLoading={isLoading}
          />
        </li>
      </ul>
    </Paper>
    // </div>
  );
};
