import { Box, Group, Text, Tooltip, rem } from "@mantine/core";
import React, { useMemo } from "react";

import { PerfLimitType } from "@/types/enum";
import { limitColors } from "~/features/performance/consts";

interface Props {
  violation: ApiPerfViolation;
}

type PhaseInfo = {
  phase: "TTFB" | "Load Delay" | "Load Time" | "Render Delay";
  timing: number;
  percent: string;
};

const getBarColors = (
  phase: PhaseInfo,
  limitInfo?: PerfViolationPhaseLimit,
) => {
  if (!limitInfo) {
    return "white";
  }
  if (phase.timing < limitInfo.value[0]) {
    return limitColors[PerfLimitType.low];
  }
  if (phase.timing < limitInfo.value[1]) {
    return limitColors[PerfLimitType.medium];
  }
  return limitColors[PerfLimitType.high];
};

export const LCPViolation: React.FC<Props> = ({ violation }) => {
  const [phaseData, phaseLimit] = useMemo(() => {
    const lcpDetails = violation.details
      .flat()
      .filter((v) => v.id === "largest-contentful-paint-element")
      .at(0)?.details;
    if (!lcpDetails || lcpDetails.type !== "list") {
      return [[], []];
    }
    return [
      (lcpDetails.items.find(
        (v) => v.type === "table" && v.headings.some((h) => h.key === "phase"),
      )?.items ?? []) as PhaseInfo[],
      violation.breakdownThresholds ?? [],
    ];
  }, [violation.breakdownThresholds, violation.details]);

  return (
    <Group align="start" gap="lg">
      <Box>
        {phaseData.map((phase) => (
          <Text
            h={rem(30)}
            ta="right"
            key={phase.phase}
          >{`${phase.phase} (${phase.timing.toFixed(2)}ms):`}</Text>
        ))}
      </Box>
      <Box
        pos="relative"
        style={{ flex: 1, borderWidth: "0 1px", borderColor: "black" }}
      >
        {phaseData.map((phase, index) => (
          <Box key={phase.phase} h={rem(30)}>
            <Tooltip label={<LimitTooltip phaseLimit={phaseLimit.at(index)} />}>
              <Box
                pos="absolute"
                h={rem(30)}
                miw="2px"
                w={phase.percent}
                bg={getBarColors(phase, phaseLimit.at(index))}
                left={`${phaseData.reduce((p, c, ind) => p + (ind < index ? Number(c.percent.substring(0, c.percent.length - 1)) : 0), 0)}%`}
              />
            </Tooltip>
          </Box>
        ))}
      </Box>
    </Group>
  );
};

type LimitTooltipProps = {
  phaseLimit?: PerfViolationPhaseLimit;
};
const LimitTooltip: React.FC<LimitTooltipProps> = ({ phaseLimit }) => {
  if (!phaseLimit) {
    return <Box>No Limit</Box>;
  }
  return (
    <Box>
      <Text fw="bold">{phaseLimit.phase}</Text>
      <Group>
        <Box w={rem(20)} h={rem(20)} bg={limitColors[PerfLimitType.low]} />
        <Text>{`< ${phaseLimit.value[0]} Good`}</Text>
      </Group>
      <Group>
        <Box w={rem(20)} h={rem(20)} bg={limitColors[PerfLimitType.medium]} />
        <Text>{`< ${phaseLimit.value[1]} Needs Improvement`}</Text>
      </Group>
      <Group>
        <Box w={rem(20)} h={rem(20)} bg={limitColors[PerfLimitType.high]} />
        <Text>{`>= ${phaseLimit.value[1]} Poor`}</Text>
      </Group>
    </Box>
  );
};
