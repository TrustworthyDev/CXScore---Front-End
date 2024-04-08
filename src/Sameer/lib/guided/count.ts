import { useMemo } from "react";
import { useSelector } from "react-redux";
import PossibleGuidedFilters from "../../lookup/guided/possible-filters.json";
import { GuidedSelectors } from "@/reduxStore/guided/guided";
import {
  UseCountViolationArgs,
  UseCountViolationForViolationsArgs,
  useCountViolation,
} from "../violations/count";
import { ManualTestResult } from "@/types/enum";
import {
  selectApplicationInfo,
  selectSelectedScan,
} from "@/reduxStore/app/app.reducer";
import { useGuidedDoDeduplicate } from "./dedupe";
import { UseQueryViolationUseHookFlags } from "../violations/query";

export type UseCountViolationForGuidedArgs = UseCountViolationArgs & {
  useHookFlags?: Omit<UseQueryViolationUseHookFlags, "useSelectedStateIds">;
};

export const useCountViolationForGuided = (
  args: UseCountViolationForViolationsArgs
) => {
  const selectedAppId = useSelector(selectApplicationInfo)?.appId ?? "";
  const selectedScanId = useSelector(selectSelectedScan)?.id ?? "";
  const checkedFilters = useGuidedCheckedFilters();
  const [doDeDuplicate] = useGuidedDoDeduplicate();
  const wcagFilters = useSelector(GuidedSelectors.selectSelectedWcagFilters);

  const { fieldMatchQueryOpts, outputOpts, useHookFlags, countByFields } = args;

  const {
    useSelectedAppId,
    useSelectedScanId,
    useCheckedFilters,
    useDoDeDuplicate,
    useWcagFilters,
  } = {
    useSelectedAppId: useHookFlags?.useSelectedAppId ?? true,
    useSelectedScanId: useHookFlags?.useSelectedScanId ?? true,
    useCheckedFilters: useHookFlags?.useCheckedFilters ?? true,
    useDoDeDuplicate: useHookFlags?.useDoDeDuplicate ?? true,
    useWcagFilters: useHookFlags?.useWcagFilters ?? true,
  };

  const queryResult = useCountViolation({
    countByFields,
    fieldMatchQueryOpts: {
      ...fieldMatchQueryOpts,
      type: fieldMatchQueryOpts?.type ?? "guided",
      appId: useSelectedAppId ? selectedAppId : fieldMatchQueryOpts?.appId,
      scanId: useSelectedScanId ? selectedScanId : fieldMatchQueryOpts?.scanId,
      stateIds: fieldMatchQueryOpts?.stateIds ?? [],
      checkedFilters: useCheckedFilters
        ? checkedFilters
        : fieldMatchQueryOpts?.checkedFilters ?? [],
      wcagFilters: useWcagFilters
        ? wcagFilters
        : fieldMatchQueryOpts?.wcagFilters,
    },
    outputOpts: {
      ...outputOpts,
      deDuplicate: useDoDeDuplicate ? doDeDuplicate : outputOpts?.deDuplicate,
    },
  });

  return queryResult;
};

export const GuidedFieldsAvailableForFilter = [
  "url",
  "rule.detailSuccessCriteria",
  "rule.detailPrinciples",
  "rule.detailWcag2021",
  "rule.detailLevel",
  "rule.name",
  "rule.issueCategory",
  "rule.issueClassification",
  "rule.issueName",
  "severity",
  "rule.type",
  "rule.element",
  "rule.detailSec508",
  "actRuleId",
  "ticketStatus",
  "type",
  "manualTestResult",
];

export const useGuidedCountAvailableFields = () => {
  const queryResult = useCountViolationForGuided({
    useHookFlags: {
      useSelectedStateIds: false,
      useCheckedFilters: false,
    },
    countByFields: [...GuidedFieldsAvailableForFilter],
  });

  const selected = useMemo(() => {
    return GuidedFieldsAvailableForFilter.map((field) => {
      const selected = queryResult.data?.find((d) => d.field === field);
      return {
        field,
        values: selected?.values ?? [],
      };
    });
  }, [queryResult.data]);

  return {
    ...queryResult,
    data: selected,
  };
};

export const GuidedFieldsAvailableForPieChart = [
  "rule.detailLevel",
  "severity",
  "rule.issueCategory",
  "manualTestResult", // this is different for guided
  "rule.type",
];

export interface UrlStatus {
  url: string;
  [ManualTestResult.pending]: number;
  [ManualTestResult.fail]: number;
  [ManualTestResult.pass]: number;
  total: number;
}

function convertArrayToTableDataURL(
  array: { value: string; count: number }[]
): UrlStatus[] {
  const result: UrlStatus[] = [];
  const urlMap = new Map<string, UrlStatus>();

  array.forEach(({ value, count }) => {
    const parts = value.split("|");
    if (parts.length !== 2) {
      console.error(`convertArrayToTableData: Invalid input: ${value}`);
      return;
    }
    const [url, status] = parts;
    let urlStatus = urlMap.get(url);
    // initialize
    if (!urlStatus) {
      urlStatus = {
        url,
        [ManualTestResult.pending]: 0,
        [ManualTestResult.pass]: 0,
        [ManualTestResult.fail]: 0,
        total: 0,
      };
      urlMap.set(url, urlStatus);
    }
    if (!Object.values(ManualTestResult).includes(status as ManualTestResult)) {
      console.error(`convertArrayToTableData: Invalid status: ${status}`);
      return;
    }
    urlStatus[status as ManualTestResult] += count;
  });

  // calculate totals
  urlMap.forEach((urlStatus) => {
    urlStatus.total =
      urlStatus[ManualTestResult.pending] +
      urlStatus[ManualTestResult.pass] +
      urlStatus[ManualTestResult.fail];
  });

  urlMap.forEach((urlStatus) => result.push(urlStatus));
  return result;
}

export const useGuidedCountByUrl = (opts?: { clientTextSearch?: string }) => {
  const queryResult = useCountViolationForGuided({
    countByFields: ["url|manualTestResult"],
  });

  const selected = useMemo(() => {
    const values =
      queryResult.data?.find((d) => d.field === "url|manualTestResult")
        ?.values ?? [];

    if (opts?.clientTextSearch) {
      const search = opts.clientTextSearch.toLowerCase();
      return convertArrayToTableDataURL(values).filter((urlStatus) => {
        return urlStatus.url.toLowerCase().includes(search);
      });
    }

    return convertArrayToTableDataURL(values);
  }, [queryResult.data]);

  return { ...queryResult, data: selected };
};

export const useGuidedCountForPieChart = () => {
  const queryResult = useGuidedCountAvailableFields();

  const selected = useMemo(() => {
    return GuidedFieldsAvailableForPieChart.map((field) => {
      const data = queryResult?.data?.find((d) => d.field === field);
      return {
        field,
        values: data?.values ?? [],
      };
    });
  }, [queryResult.data]);

  return {
    ...queryResult,
    data: selected,
  };
};

export const useGuidedCheckedFilterCount = () => {
  const queryResult = useGuidedCountForPieChart();
  const checkedFilters = useSelector(GuidedSelectors.selectCheckedFilters);

  if (queryResult.data) {
    let filterCounts: Partial<
      Record<
        keyof typeof PossibleGuidedFilters,
        {
          field: string;
          value: string;
          count: number;
          checked: boolean;
        }
      >
    > = {};

    const result = queryResult.data;

    for (let filter in checkedFilters) {
      // find the field that matches the filter key field

      let filterKey = filter as keyof typeof PossibleGuidedFilters;

      const field = result.find(
        (key: any) => key.field === PossibleGuidedFilters[filterKey]?.field
      );

      if (field) {
        // get count of violations for filter key field value
        const fieldValue = field.values.find(
          (value: any) => value.value === PossibleGuidedFilters[filterKey].value
        );

        const count = fieldValue ? fieldValue.count : 0;

        const result = {
          field: field.field,
          value: PossibleGuidedFilters[filterKey].value,
          count: count,
          checked: checkedFilters[filterKey],
        };

        filterCounts = { ...filterCounts, [filterKey]: result };
      }
    }

    return { ...queryResult, data: filterCounts };
  }

  return { ...queryResult, data: null };
};

export const useGuidedCheckedFilters = () => {
  const checkedFilters = useSelector(GuidedSelectors.selectCheckedFilters);

  const filters = Object.keys(checkedFilters) as Array<
    keyof typeof PossibleGuidedFilters
  >;

  return filters.filter((key) => checkedFilters[key]);
};

export const useGuidedCheckedFiltersByField = (
  fieldKey: keyof typeof GuidedFiltersGroupedByField
) => {
  const checkedFilters = useSelector(GuidedSelectors.selectCheckedFilters);

  const filter = GuidedFiltersGroupedByField[fieldKey];

  const filters = Object.keys(filter) as Array<
    keyof typeof PossibleGuidedFilters
  >;

  return filters.filter((key) => checkedFilters[key]);
};

export const GuidedFiltersGroupedByField: Record<
  string,
  Partial<typeof PossibleGuidedFilters>
> = Object.keys(PossibleGuidedFilters).reduce((acc, key) => {
  const item = PossibleGuidedFilters[key as keyof typeof PossibleGuidedFilters];
  acc[item.fieldLabel] = {
    ...acc[item.fieldLabel],
    [key]: item,
  };
  return acc;
}, {} as Record<string, Partial<typeof PossibleGuidedFilters>>);
