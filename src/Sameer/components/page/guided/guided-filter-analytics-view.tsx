import { Paper } from "../../atoms/paper";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { GuidedFilterPieCharts } from "./guided-filter-pie-charts";
import { GuidedQuickInfo } from "./guided-quick-info";
import { GuidedWcagSelectionFilter } from "./guided-wcag-selection-filter";

export const GuidedFilterAnalyticsView = () => {
  const [parent] = useAutoAnimate<HTMLDivElement>();

  return (
    <div className="space-y-2">
      <Paper>
        <GuidedWcagSelectionFilter />
      </Paper>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="whitespace-nowrap p-0 font-display text-2xl font-semibold">
          Guided Manual Validations
        </h1>
        <div className="flex flex-col flex-wrap items-end gap-2">
          <GuidedQuickInfo />
        </div>
      </div>
      <Paper className="space-y-4">
        {/* <button
        aria-label="Filter Menu"
        onClick={() => handleChangeFilterSidebarOpen(!isFilterSidebarOpen)}
        className="flex items-center space-x-4"
      >
        <h2 className="font-display text-xl font-semibold uppercase">
          Filter based analysis
        </h2>
        <div>
          <FilterVector className="stroke-black" />
        </div>
      </button> */}
        <div ref={parent} className="flex flex-wrap items-start justify-evenly">
          <GuidedFilterPieCharts />
        </div>
      </Paper>
    </div>
  );
};
