import { useCallback } from "react";
import { useSelectedAppId } from "../../../lib/application/use-application-data";
import { useExportToCSV } from "../../../lib/util/use-export-to-csv";
import { useViolations } from "../../../lib/violations/query";
import { useSelector } from "react-redux";
import { selectSelectedScan } from "@/reduxStore/app/app.reducer";
import { useViolationsDoDeduplicate } from "../../../lib/violations/dedupe";
import { getApiViolationFields } from "../../../lib/util/table-utils";
import { Button } from "@mantine/core";

export const ViolationsExportToCsvButton = () => {
  const applicationId = useSelectedAppId() ?? "";
  const scanId = useSelector(selectSelectedScan)?.id ?? "";

  const {
    data: allData,
    isLoading: isAllDataLoading,
    isError: isAllDataError,
  } = useViolations({
    outputOpts: {
      getAllViolations: true,
    },
  });

  const [dedupe] = useViolationsDoDeduplicate();

  const { handleExportToCSV, isExporting } = useExportToCSV({
    filename: `violations-appId-${applicationId}-scanId-${scanId}`,
    parserOpts: {
      fields: getApiViolationFields({
        dedupe,
      }),
    },
  });

  const handleExport = useCallback(() => {
    if (isAllDataLoading) {
      return;
    }

    if (isAllDataError) {
      alert("Something went wrong while exporting to CSV");
      return;
    }

    handleExportToCSV(allData.result);
  }, [isAllDataLoading, isAllDataError, allData, handleExportToCSV]);

  return (
    <Button
      disabled={isExporting || isAllDataError}
      loading={isAllDataLoading}
      onClick={handleExport}
    >
      {!isExporting ? "Export to CSV" : "Exporting..."}
    </Button>
  );
};
