import { useAutoAnimate } from "@formkit/auto-animate/react";
import React from "react";

import { ViolationWcagSelectionFilter } from "./violation-wcag-selection-filter";
import { ViolationsFilterPieCharts } from "./violations-filter-pie-charts";
import { ViolationsQuickInfo } from "./violations-quick-info";
import { Paper } from "../../atoms/paper";

interface ViolationsFilterAnalyticsViewProps {}

export const ViolationsFilterAnalyticsView: React.FC<
  ViolationsFilterAnalyticsViewProps
> = () => {
  const [parent] = useAutoAnimate<HTMLDivElement>();

  return (
    <div className="space-y-2">
      <Paper>
        <ViolationWcagSelectionFilter />
      </Paper>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="whitespace-nowrap p-0 font-display text-2xl font-semibold">
          Violations Summary
        </h2>
        <div className="flex flex-col flex-wrap items-end gap-2">
          <ViolationsQuickInfo />
        </div>
      </div>
      <Paper className="space-y-4">
        <div ref={parent} className="flex flex-wrap items-start justify-evenly">
          <ViolationsFilterPieCharts />
        </div>
      </Paper>
    </div>
  );
};
