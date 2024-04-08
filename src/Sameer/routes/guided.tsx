import { Box } from "@mantine/core";

import { HeaderBar } from "../components/page/common/header-bar";
import { GuidedDedupeToggle } from "../components/page/guided/guided-dedupe-toggle";
import { GuidedFilterAnalyticsView } from "../components/page/guided/guided-filter-analytics-view";
import { GuidedFilterTable } from "../components/page/guided/guided-filter-table";
import { GuidedUrlTableView } from "../components/page/guided/guided-url-table";

export default function Guided() {
  return (
    <Box px="lg">
      <HeaderBar rightComponent={<GuidedDedupeToggle />} />

      <div className="space-y-2  py-2">
        <div className="space-y-2" id="guided-summary">
          <div className="py-2 xl:container xl:mx-auto">
            <GuidedFilterAnalyticsView />
          </div>

          <div className="space-y-2 py-2 xl:container xl:mx-auto">
            <GuidedUrlTableView />
          </div>
        </div>

        <div className="mx-auto max-w-full py-2">
          <GuidedFilterTable />
        </div>
      </div>
    </Box>
  );
}
