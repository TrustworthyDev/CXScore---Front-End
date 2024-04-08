import { DownloadIcon } from "@/icons/Download";
import { useSelectedAppId } from "../../../lib/application/use-application-data";
import { useExportToCSV } from "../../../lib/util/use-export-to-csv";
import { VerticalSeparator } from "../../atoms/seperator/vertical-separator";
import { SmallSpinner } from "../../atoms/loading";
import { WarningIcon } from "@/icons/Warning";
import {
  ViolationFieldNamesForExport,
  getApiViolationFields,
} from "../../../lib/util/table-utils";
import { useGuidedDoDeduplicate } from "../../../lib/guided/dedupe";
import { useGuided } from "../../../lib/guided/query";

export const GuidedQuickInfo = () => {
  const applicationId = useSelectedAppId() ?? "";

  const firstQuery = useGuided({
    useHookFlags: {
      useSelectedAppId: true,
      useSelectedScanId: true,
      useDoDeDuplicate: true,
      useCheckedFilters: true,
      useWcagFilters: true,
    },
  });

  const fullQuery = useGuided({
    useHookFlags: {
      useSelectedAppId: true,
      useSelectedScanId: true,
      useDoDeDuplicate: true,
      useCheckedFilters: true,
      useWcagFilters: true,
    },
    outputOpts: {
      fields: ViolationFieldNamesForExport,
      getAllViolations: true,
    },
  });

  const [dedupe] = useGuidedDoDeduplicate();
  const { handleExportToCSV, isExporting } = useExportToCSV({
    filename: `guided-${applicationId}-${new Date().toISOString()}`,
    parserOpts: {
      fields: getApiViolationFields({
        dedupe,
      }),
    },
  });

  const exportToCSVLoading =
    isExporting || fullQuery.isLoading || fullQuery.isFetching;

  const exportToCSVDisabled = fullQuery.isError || exportToCSVLoading;

  return (
    <>
      <div className="flex items-center gap-2">
        <WarningIcon />
        <div className="flex items-center font-display text-2xl text-gray-700">
          Total Violations:{" "}
          {!firstQuery.isFetching ? (
            <span className="ml-2 rounded-3xl border border-red-700 py-0.5 px-4 font-semibold text-red-700">
              {firstQuery.data?.totalCount}{" "}
            </span>
          ) : (
            <SmallSpinner className="my-2 mx-4" />
          )}
        </div>
        {/* <VerticalSeparator />
        <button
          aria-label="Export to CSV"
          disabled={exportToCSVDisabled}
          onClick={() => handleExportToCSV(fullQuery.data?.result ?? [])}
          className={exportToCSVDisabled ? "cursor-not-allowed" : ""}
        >
          {!exportToCSVLoading ? (
            <DownloadIcon fill="#4578DC" />
          ) : (
            <SmallSpinner className="!ml-0" />
          )}
        </button> */}
      </div>
    </>
  );
};
