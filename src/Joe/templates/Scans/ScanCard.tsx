import React from "react";
import { useMemo } from "react";
import { ScanSubType, ScanType } from "@/types/enum";
import { SinglePage } from "@/icons/SinglePage";
import { MultiPage } from "@/icons/MultiPage";
import { FullApp } from "@/icons/FullApp";
import HeadingTwo from "../../../Suraj/component/common/headings/HeadingTwo";
import { toast } from "react-toastify";
import { Box, Button, Group, Paper, Stack } from "@mantine/core";

const primarySVGFill = "#545454";
const secondarySVGFill = "#FFFFFF";

type ScanCardProps = {
  scanType: ScanType;
  activeScan: [ScanType | null, ScanSubType | null];
  onChangeActiveScan: (
    activeScan: [ScanType | null, ScanSubType | null]
  ) => void;
};

const scanTypeStr = {
  [ScanType.SinglePageScan]: "Single Page Scan",
  [ScanType.MultiPageScan]: "Multi Page Scan",
  [ScanType.FullPageScan]: "Full App Scan",
  [ScanType.ViolationReScan]: "Violation ReScan",
};

const scanSubTypeStr = {
  [ScanSubType.RapidScan]: "Rapid Scan",
  [ScanSubType.DeepScan]: "Deep Scan",
  [ScanSubType.PriorityScan]: "Priority Scan",
  [ScanSubType.FullScan]: "Full Scan",
};

export const ScanCard: React.FC<ScanCardProps> = ({
  scanType,
  activeScan: [activeScanType, activeScanSubType],
  onChangeActiveScan,
}) => {
  const isActiveScan = activeScanType === scanType;
  const scanSubTypes: ScanSubType[] = useMemo(
    () =>
      scanType === ScanType.FullPageScan
        ? [ScanSubType.FullScan]
        : [ScanSubType.RapidScan, ScanSubType.DeepScan],
    [scanType]
  );

  const handleClickSubType = (e: React.MouseEvent, subType: ScanSubType) => {
    onChangeActiveScan([
      scanType,
      isActiveScan && subType === activeScanSubType ? null : subType,
    ]);
    if (subType === ScanSubType.FullScan) {
      toast("This feature is available only in production");
    }
    e.stopPropagation();
  };

  const scanTypeIconHandler = (scanType: string) => {
    switch (scanType) {
      case ScanType.SinglePageScan:
        return (
          <SinglePage
            size={120}
            fill={isActiveScan ? secondarySVGFill : primarySVGFill}
            role="presentation"
          />
        );
      case ScanType.MultiPageScan:
        return (
          <MultiPage
            size={120}
            fill={isActiveScan ? secondarySVGFill : primarySVGFill}
            role="presentation"
          />
        );
      case ScanType.FullPageScan:
        return (
          <FullApp
            size={120}
            fill={isActiveScan ? primarySVGFill : secondarySVGFill}
            stroke={isActiveScan ? secondarySVGFill : primarySVGFill}
            role="presentation"
          />
        );
    }

    return null;
  };

  return (
    <Paper bg={isActiveScan ? 
      "var(--mantine-color-blue-filled)" : 
      "var(--mantine-color-white)"}
      py="xl"
      shadow="lg"
    >
      <Stack justify="center" px="lg" pb="lg">
        <Box pb="lg">
          <HeadingTwo
            text={scanTypeStr[scanType]}
            className={`text-left ${
              isActiveScan ? "text-white" : "text-[#545454]"
            }`}
          />
        </Box>
        <Group justify="space-between">
          {scanTypeIconHandler(scanType)}
          {/* {scanTypeIcon[scanType]} */}
          <Stack justify="space-evenly">
            {scanSubTypes.map((scanSubType) => (
              <Button
                key={`subtype-btn-${scanSubType}`}
                variant={isActiveScan && scanSubType === activeScanSubType ? "default" : "filled"}
                onClick={(e) => handleClickSubType(e, scanSubType)}
              >
                <HeadingTwo text={scanSubTypeStr[scanSubType]} />
              </Button>
            ))}
          </Stack>
        </Group>
      </Stack>
    </Paper>
  );
};
