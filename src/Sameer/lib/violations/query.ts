import { useQuery } from "@tanstack/react-query";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { useSelector } from "react-redux";

import { Api, getViolationDetail } from "@/api";
import {
  selectApplicationInfo,
  selectSelectedScan,
} from "@/reduxStore/app/app.reducer";
import { ViolationsSelectors } from "@/reduxStore/violations/violations";
import { ManualTestResult } from "@/types/enum";

import {
  ViolationsAllPossibleFilters,
  useViolationsCheckedFilters,
} from "./count";
import { useViolationsDoDeduplicate } from "./dedupe";
import GuidedFilterData from "../../lookup/guided/possible-filters.json";
import { QueryKeys } from "../../lookup/query-keys";
import ViolationFilterData from "../../lookup/violations/possible-filters.json";

export type QueryViolationOutput = {
  output: {
    sort?: Record<string, -1 | 1>;
    first?: number;
    size?: number;
    group?: string;
    fields?: Array<string>;
  };
  textSearch?: string;
};

export type ToQueryViolationOutputArgs = {
  sort?: SortingState;
  fields?: Array<string>;
  pagination?: PaginationState;
  getAllViolations?: boolean;
  textSearch?: string;
  deDuplicate?: boolean;
  overrideOutput?: Partial<QueryViolationOutput["output"]>;
};

export const toQueryViolationOutput = ({
  ...opts
}: ToQueryViolationOutputArgs): QueryViolationOutput => {
  const output: Partial<QueryViolationOutput["output"]> = {};
  if (opts.sort) {
    output.sort = opts.sort.reduce(
      (acc, sort) => {
        acc[sort.id] = sort.desc ?? true ? -1 : 1;
        return acc;
      },
      {} as Record<string, -1 | 1>,
    );

    output.sort = Object.keys(output.sort).length ? output.sort : undefined;
  }

  if (opts.pagination) {
    output.first = opts.pagination.pageIndex * opts.pagination.pageSize;
    output.size = opts.pagination.pageSize;
  }

  if (opts.getAllViolations) {
    output.first = undefined;
    output.size = undefined;
  }

  if (opts.deDuplicate) {
    output.group = "groupId";
  }

  if (opts.fields) {
    output.fields = opts.fields;
  }

  return {
    output: { ...output, ...opts.overrideOutput },
    textSearch: opts.textSearch,
  };
};

export type DynamicFilter = {
  field: string;
  value?: string;
  valueList?: Array<string>;
};

export type LookupFilterData = Record<
  string,
  {
    field: string;
    fieldLabel: string;
    value: string;
    label: string;
    color: string;
    abbreviation: string;
  }
>;

const filtersByType = {
  violation: ViolationFilterData,
  guided: GuidedFilterData,
  all: {
    ...GuidedFilterData,
    ...ViolationFilterData,
  },
};
export const convertCheckedFiltersToApiBody = (
  checkedFilters: Array<string> = [],
  type: "violation" | "guided" | "all",
) => {
  const lookupFilterData = filtersByType[type];
  const filters =
    checkedFilters.length > 0 ? checkedFilters : Object.keys(lookupFilterData);

  const filterBody = new Map<string, DynamicFilter>();
  filters?.forEach((filter) => {
    try {
      const filterData =
        lookupFilterData[filter as keyof typeof lookupFilterData];
      const existing = filterBody.get(filterData.field);
      if (!existing) {
        filterBody.set(filterData.field, {
          field: filterData.field,
          value: filterData.value,
        });
      } else {
        filterBody.set(filterData.field, {
          field: filterData.field,
          ...(existing.value && {
            valueList: [...[existing.value], filterData.value],
            value: undefined,
          }),
          ...(existing.valueList && {
            valueList: [...existing.valueList, filterData.value],
            value: undefined,
          }),
        });
      }
    } catch (e) {
      console.error(
        `error converting checked filters to api body in loop for '${filter}'`,
      ); // eslint-disable-line no-console
      console.log(e); // eslint-disable-line no-console
    }
  });

  return [...filterBody.values()];
};

export interface ToQueryViolationFieldMatchQueryArgs {
  type?: "violation" | "guided" | "all";
  appId?: string;
  scanId?: string;
  stateIds?: Array<string>;
  checkedFilters?: Array<string>;
  wcagFilters?: Array<string>;
  profile?: DefaultScanConfig;
  overrideFieldMatchQuery?: DynamicFilter[];
}

export const toQueryViolationFieldMatchQuery = (
  args: ToQueryViolationFieldMatchQueryArgs,
) => {
  const {
    type,
    appId,
    scanId,
    stateIds,
    checkedFilters,
    wcagFilters,
    profile,
    overrideFieldMatchQuery,
  } = args;

  const fieldMatchQuery = [
    ...(checkedFilters != null
      ? convertCheckedFiltersToApiBody(checkedFilters, type ?? "violation")
      : []),
    ...(appId != null && appId !== ""
      ? [
          {
            field: "application.id",
            value: appId,
          },
        ]
      : []),
    ...(scanId != null && scanId !== ""
      ? [
          {
            field: "scan.id",
            value: scanId,
          },
        ]
      : []),
    ...(stateIds != null && stateIds.length > 0
      ? [
          {
            field: "stateId",
            valueList: stateIds,
          },
        ]
      : []),
    ...(wcagFilters != null && wcagFilters.length > 0
      ? [
          {
            field: "rule.detailWcag2021",
            valueList: wcagFilters,
          },
        ]
      : []),
    ...(type === "violation"
      ? [
          {
            field: "manualTestResult",
            value: ManualTestResult.fail,
          },
        ]
      : []),
    ...(type === "guided"
      ? [
          // {
          //   field: "type",
          //   value: "guided_test",
          // },
          {
            field: "needFix",
            value: "no",
          },
        ]
      : []),
    ...(profile != null
      ? [
          ...(profile.device
            ? [
                {
                  field: "profile.device",
                  value: profile.device,
                },
              ]
            : []),

          ...(profile.windowSize
            ? [
                {
                  field: "profile.windowSize",
                  value: profile.windowSize,
                },
              ]
            : []),

          ...(profile.orientation
            ? [
                {
                  field: "profile.orientation",
                  value: profile.orientation,
                },
              ]
            : []),

          ...(profile.deviceScaleFactor
            ? [
                {
                  field: "profile.deviceScaleFactor",
                  value: profile.deviceScaleFactor,
                },
              ]
            : []),

          ...(profile.defaultFontSize
            ? [
                {
                  field: "profile.defaultFontSize",
                  value: profile.defaultFontSize,
                },
              ]
            : []),
        ]
      : []),
    ...(overrideFieldMatchQuery ?? []),
  ];

  return fieldMatchQuery;
};

export type QueryViolationResult = {
  result: ApiViolation[];
  totalCount: number;
};

export type QueryViolationFetchArgs = {
  fieldMatchQueryOpts?: ToQueryViolationFieldMatchQueryArgs;
  outputOpts?: ToQueryViolationOutputArgs;
};

export const getQueryViolationFetchFn = ({
  fieldMatchQueryOpts,
  outputOpts,
}: QueryViolationFetchArgs) => {
  return () =>
    Api.post<unknown, QueryViolationResult>("/query-violation", {
      fieldMatchQuery: toQueryViolationFieldMatchQuery(
        fieldMatchQueryOpts ?? {},
      ),
      ...toQueryViolationOutput(outputOpts ?? {}),
    });
};

export const getExportViolationFetchFn = ({
  fieldMatchQueryOpts,
  outputOpts,
}: QueryViolationFetchArgs) => {
  return () =>
    Api.post<unknown, string>("/export-violation", {
      fieldMatchQuery: toQueryViolationFieldMatchQuery(
        fieldMatchQueryOpts ?? {},
      ),
      ...toQueryViolationOutput(outputOpts ?? {}),
    });
};

export type UseQueryViolationUseHookFlags = {
  useSelectedAppId?: boolean;
  useSelectedScanId?: boolean;
  useSelectedStateIds?: boolean;
  useCheckedFilters?: boolean; // if this is false, all possible filters will be selected
  useDoDeDuplicate?: boolean;
  useWcagFilters?: boolean;
};

// master hook for all /query-violation
export const useQueryViolation = (args: QueryViolationFetchArgs) => {
  const queryResult = useQuery({
    queryKey: QueryKeys.queryViolation(args),
    queryFn: getQueryViolationFetchFn(args),
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return queryResult;
};

export type UseViolationArgs = {
  useHookFlags?: UseQueryViolationUseHookFlags; // decide whether to use from global state
} & QueryViolationFetchArgs;

export const useQueryViolationArgs = (args: UseViolationArgs) => {
  const selectedAppId = useSelector(selectApplicationInfo)?.appId ?? "";
  const selectedScanId = useSelector(selectSelectedScan)?.id ?? "";
  const checkedFilters = useViolationsCheckedFilters();
  const [doDeDuplicate] = useViolationsDoDeduplicate();
  const selectedStateIds = useSelector(
    ViolationsSelectors.selectSelectedStateIds,
  );
  const wcagFilters = useSelector(
    ViolationsSelectors.selectSelectedWcagFilters,
  );

  const { outputOpts, fieldMatchQueryOpts, useHookFlags } = args;

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

  const finalFieldMatchQueryArgs: ToQueryViolationFieldMatchQueryArgs = {
    ...fieldMatchQueryOpts,
    type: "violation",
    appId: useSelectedAppId ? selectedAppId : fieldMatchQueryOpts?.appId,
    scanId: useSelectedScanId ? selectedScanId : fieldMatchQueryOpts?.scanId,
    stateIds: useSelectedStateIds
      ? selectedStateIds
      : fieldMatchQueryOpts?.stateIds,
    checkedFilters: useCheckedFilters
      ? checkedFilters
      : fieldMatchQueryOpts?.checkedFilters ?? ViolationsAllPossibleFilters,
    wcagFilters: useWcagFilters
      ? wcagFilters
      : fieldMatchQueryOpts?.wcagFilters,
  };

  const finalOutputArgs: ToQueryViolationOutputArgs = {
    ...outputOpts,
    deDuplicate: useDoDeDuplicate ? doDeDuplicate : outputOpts?.deDuplicate,
  };

  return {
    fieldMatchQueryOpts: finalFieldMatchQueryArgs,
    outputOpts: finalOutputArgs,
  };
};

export const useViolations = (args: UseViolationArgs) => {
  const { fieldMatchQueryOpts, outputOpts } = useQueryViolationArgs(args);

  const queryResult = useQueryViolation({
    ...args,
    fieldMatchQueryOpts,
    outputOpts,
  });

  return queryResult;
};

export const useViolationById = (args: { violationId: string }) => {
  const { violationId } = args;
  const queryResult = useQuery({
    queryKey: QueryKeys.violationItem(violationId),
    queryFn: () => getViolationDetail(violationId),
  });

  return queryResult;
};

// May need to move the below code to a different file

interface ApiSalesReport {
  Counts: {
    "Color Contrast": number;
    Guided: number;
    "Screen Reader": number;
    Keyboard: number;
    "Audio & Video": number;
    RWD: number;
    "Structure & Layout": number;
    "User Controls": number;
  };
  Violations: {
    "Color Contrast": ApiViolation[];
    Guided: ApiViolation[];
    "Screen Reader": ApiViolation[];
    Keyboard: ApiViolation[];
    "Audio & Video": ApiViolation[];
    RWD: ApiViolation[];
    "Structure & Layout": ApiViolation[];
    "User Controls": ApiViolation[];
  };
}

export const salesReportQueryFn = (
  appName: string,
  scanIds?: string[],
  urlList?: string[],
) => {
  return async () => {
    const body = {
      app_name: appName,
      scan_ids: scanIds,
      url_list: urlList,
    };
    return Api.post<unknown, ApiSalesReport>("/sales-report", body);
  };
};

export const useSalesReportViolations = (
  appName: string,
  scanIds: string[],
  urlList: string[],
) => {
  const queryResult = useQuery<ApiSalesReport>({
    queryKey: ["salesReport", scanIds, appName],
    queryFn: salesReportQueryFn(appName, scanIds, urlList),
  });

  // Sort the queryResult
  if (queryResult.isSuccess) {
    const sortedCounts = Object.keys(queryResult.data.Counts).sort((a, b) => {
      const sortOrder = [
        "Screen Reader",
        "Keyboard",
        "Color Contrast",
        "Guided",
        "Audio & Video",
        "RWD",
        "Structure & Layout",
        "User Controls",
      ];
      return sortOrder.indexOf(a) - sortOrder.indexOf(b);
    });

    const sortedViolations: Partial<ApiSalesReport["Violations"]> = {};
    sortedCounts.forEach((countKey) => {
      sortedViolations[countKey as keyof ApiSalesReport["Violations"]] =
        queryResult.data.Violations[
          countKey as keyof ApiSalesReport["Violations"]
        ];
    });

    const sortedCountsObject: Partial<ApiSalesReport["Counts"]> = {};
    sortedCounts.forEach((countKey) => {
      sortedCountsObject[countKey as keyof ApiSalesReport["Counts"]] =
        queryResult.data.Counts[countKey as keyof ApiSalesReport["Counts"]];
    });

    queryResult.data.Counts = sortedCountsObject as ApiSalesReport["Counts"];
    queryResult.data.Violations =
      sortedViolations as ApiSalesReport["Violations"];
  }

  return queryResult;
};

