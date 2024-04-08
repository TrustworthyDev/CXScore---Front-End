import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../lookup/query-keys";
import { Api } from "@/api";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import PossibleViolationsFilters from "../../lookup/violations/possible-filters.json";
import { ViolationsSelectors } from "@/reduxStore/violations/violations";
import {
  ToQueryViolationFieldMatchQueryArgs,
  ToQueryViolationOutputArgs,
  toQueryViolationOutput,
  toQueryViolationFieldMatchQuery,
  UseQueryViolationUseHookFlags,
} from "./query";
import {
  selectApplicationInfo,
  selectSelectedScan,
} from "@/reduxStore/app/app.reducer";
import { useViolationsDoDeduplicate } from "./dedupe";
import { countBy } from "ramda";

export type ViolationsCountResponseItem = {
  field: string;
  values: {
    value: string;
    count: number;
  }[];
};

// can be used with toQueryViolationOutput
export type ToCountViolationOutputArgs = Omit<
  ToQueryViolationOutputArgs,
  // remove the not useful ones
  "sort" | "pagination" | "getAllViolations"
>;

export type CountViolationsFetchArgs = {
  countByFields?: string[];
  fieldMatchQueryOpts?: ToQueryViolationFieldMatchQueryArgs;
  outputOpts?: ToCountViolationOutputArgs;
};

export const getCountViolationFetchFn = ({
  countByFields,
  fieldMatchQueryOpts,
  outputOpts,
}: CountViolationsFetchArgs) => {
  return () =>
    Api.post<unknown, ViolationsCountResponseItem[]>("/count-violation", {
      ...toQueryViolationOutput({
        ...outputOpts,
      }),
      fieldMatchQuery: toQueryViolationFieldMatchQuery({
        ...fieldMatchQueryOpts,
      }),
      countByField: countByFields,
    });
};

export type UseCountViolationArgs = {
  countByFields?: string[];
  // useQueryOpts?: Partial<Omit<UseQueryOptions, "queryKey" | "queryFn">>;
} & CountViolationsFetchArgs;

export const useCountViolation = (args: UseCountViolationArgs) => {
  const { outputOpts, fieldMatchQueryOpts } = args;

  const finalCountViolationArgs = {
    countByFields: args.countByFields,
    fieldMatchQueryOpts,
    outputOpts,
  };

  const queryResult = useQuery({
    queryKey: QueryKeys.countViolation(finalCountViolationArgs),
    queryFn: getCountViolationFetchFn(finalCountViolationArgs),
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return queryResult;
};

export type UseCountViolationForViolationsArgs = UseCountViolationArgs & {
  useHookFlags?: UseQueryViolationUseHookFlags;
};

export const useCountViolationForViolations = (
  args: UseCountViolationForViolationsArgs
) => {
  const selectedAppId = useSelector(selectApplicationInfo)?.appId ?? "";
  const selectedScanId = useSelector(selectSelectedScan)?.id ?? "";
  const checkedFilters = useViolationsCheckedFilters();
  const [doDeDuplicate] = useViolationsDoDeduplicate();
  const selectedStateIds = useSelector(
    ViolationsSelectors.selectSelectedStateIds
  );
  const wcagFilters = useSelector(
    ViolationsSelectors.selectSelectedWcagFilters
  );

  const { fieldMatchQueryOpts, outputOpts, useHookFlags, countByFields } = args;

  const {
    useSelectedAppId,
    useSelectedScanId,
    useSelectedStateIds,
    useCheckedFilters,
    useDoDeDuplicate,
    useWcagFilters,
  } = {
    useSelectedAppId: useHookFlags?.useSelectedAppId ?? true,
    useSelectedScanId: useHookFlags?.useSelectedScanId ?? true,
    useSelectedStateIds: useHookFlags?.useSelectedStateIds ?? true,
    useCheckedFilters: useHookFlags?.useCheckedFilters ?? true,
    useDoDeDuplicate: useHookFlags?.useDoDeDuplicate ?? true,
    useWcagFilters: useHookFlags?.useWcagFilters ?? true,
  };

  const queryResult = useCountViolation({
    countByFields,
    fieldMatchQueryOpts: {
      ...fieldMatchQueryOpts,
      type: fieldMatchQueryOpts?.type ?? "violation",
      appId: useSelectedAppId ? selectedAppId : fieldMatchQueryOpts?.appId,
      scanId: useSelectedScanId ? selectedScanId : fieldMatchQueryOpts?.scanId,
      stateIds: useSelectedStateIds
        ? selectedStateIds
        : fieldMatchQueryOpts?.stateIds,
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

export const ViolationsFieldsAvailableForFilter = [
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
];

export const useViolationsCountAvailableFields = () => {
  const queryResult = useCountViolationForViolations({
    useHookFlags: {
      useSelectedStateIds: false,
      useCheckedFilters: false,
    },
    countByFields: [...ViolationsFieldsAvailableForFilter],
  });

  const selected = useMemo(() => {
    return ViolationsFieldsAvailableForFilter.map((field) => {
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

export const ViolationsFieldsAvailableForPieChart = [
  "rule.detailLevel",
  "severity",
  "rule.issueCategory",
  "ticketStatus",
  "rule.type",
];

export const useViolationsCountForPieChart = () => {
  const queryResult = useCountViolationForViolations({
    useHookFlags: {
      useSelectedStateIds: false,
      useCheckedFilters: false,
    },
    countByFields: [...ViolationsFieldsAvailableForPieChart],
  });

  const selected = useMemo(() => {
    return ViolationsFieldsAvailableForPieChart.map((field) => {
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

export const useViolationsCheckedFilterCount = () => {
  const queryResult = useViolationsCountForPieChart();
  const checkedFilters = useSelector(ViolationsSelectors.selectCheckedFilters);

  if (queryResult.data) {
    let filterCounts: Partial<
      Record<
        keyof typeof PossibleViolationsFilters,
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

      let filterKey = filter as keyof typeof PossibleViolationsFilters;

      const field = result.find(
        (key: any) => key.field === PossibleViolationsFilters[filterKey]?.field
      );

      if (field) {
        // get count of violations for filter key field value
        const fieldValue = field.values.find(
          (value: any) =>
            value.value === PossibleViolationsFilters[filterKey].value
        );

        const count = fieldValue ? fieldValue.count : 0;

        const result = {
          field: field.field,
          value: PossibleViolationsFilters[filterKey].value,
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

export const useViolationsCheckedFilters = () => {
  const checkedFilters = useSelector(ViolationsSelectors.selectCheckedFilters);

  const filters = Object.keys(checkedFilters) as Array<
    keyof typeof PossibleViolationsFilters
  >;

  return filters.filter((key) => checkedFilters[key]);
};

export const useViolationsCheckedFiltersByField = (
  fieldKey: keyof typeof ViolationsFiltersGroupedByField
) => {
  const checkedFilters = useSelector(ViolationsSelectors.selectCheckedFilters);

  const filter = ViolationsFiltersGroupedByField[fieldKey];

  const filters = Object.keys(filter) as Array<
    keyof typeof PossibleViolationsFilters
  >;

  return filters.filter((key) => checkedFilters[key]);
};

export const ViolationsFiltersGroupedByField: Record<
  string,
  Partial<typeof PossibleViolationsFilters>
> = Object.keys(PossibleViolationsFilters).reduce((acc, key) => {
  const item =
    PossibleViolationsFilters[key as keyof typeof PossibleViolationsFilters];
  acc[item.fieldLabel] = {
    ...acc[item.fieldLabel],
    [key]: item,
  };
  return acc;
}, {} as Record<string, Partial<typeof PossibleViolationsFilters>>);

export const ViolationsAllPossibleFilters = Object.keys(
  PossibleViolationsFilters
) as Array<keyof typeof PossibleViolationsFilters>;

export const useViolationsCountByElement = (args?: UseCountViolationArgs) => {
  const queryResult = useCountViolationForViolations({
    ...args,
    countByFields: ["rule.issueClassification"],
    fieldMatchQueryOpts: {
      ...args?.fieldMatchQueryOpts,
      type: "violation",
    },
  });

  const selected = useMemo(() => {
    return (
      queryResult.data
        ?.find((d) => d.field === "rule.issueClassification")
        ?.values.map((value) => ({
          element: value.value,
          count: value.count,
        })) ?? []
    );
  }, [queryResult.data]);

  return { ...queryResult, data: selected };
};
