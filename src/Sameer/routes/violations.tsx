import { Box, Group, Title } from "@mantine/core";

import { SelectedScanDiscovery } from "../components/page/common/discovery/discovery";
import { HeaderBar } from "../components/page/common/header-bar";
import { SelectedScanAdvancedScanConfigSummary } from "../components/page/common/scan-config/selected-app-advanced-scan-config-summary";
import { ViolationsDedupeToggle } from "../components/page/violations/violations-dedupe-toggle";
import { ViolationsElementsTable } from "../components/page/violations/violations-elements-table";
import { ViolationsFilterAnalyticsView } from "../components/page/violations/violations-filter-analytics-view";
import { ViolationsFilterTable } from "../components/page/violations/violations-filter-table";
import { ViolationsUrlTable } from "../components/page/violations/violations-url-table";

export default function Violations() {
  return (
    <Box px="lg">
      <Title order={1} className="sr-only">
        Violations
      </Title>
      <HeaderBar rightComponent={<ViolationsDedupeToggle />} />
      <div className="space-y-2">
        <div className="space-y-2 py-2 xl:container xl:mx-auto">
          <Group wrap="wrap" justify="space-between">
            <Title order={2}>Discovery</Title>
            <SelectedScanAdvancedScanConfigSummary />
          </Group>
          <SelectedScanDiscovery queryAllScans={true} />
        </div>

        <div className="space-y-2" id="violation-summary">
          <div className="py-2 xl:container xl:mx-auto">
            <ViolationsFilterAnalyticsView />
          </div>

          <div className="space-y-2 py-2 xl:container xl:mx-auto">
            <Title order={2}>Top URLs by Violations</Title>
            <ViolationsUrlTable />
          </div>

          <div className="space-y-2 py-2 xl:container xl:mx-auto">
            <Title order={2}>Top Elements by Violations</Title>
            <ViolationsElementsTable />
          </div>
        </div>

        <div className="mx-auto max-w-full py-2">
          <ViolationsFilterTable />
        </div>
      </div>
    </Box>
  );
}

