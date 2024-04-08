import { Api, getScanStatus } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../lookup/query-keys";
import {
  ToQueryViolationFieldMatchQueryArgs,
  toQueryViolationFieldMatchQuery,
} from "./query";
import { ManualTestResult } from "@/types/enum";
import { useViolationsDoDeduplicate } from "./dedupe";
import { useViolationsCheckedFilters } from "./count";
import { useSelector } from "react-redux";
import {
  selectApplicationInfo,
  selectSelectedScan,
} from "@/reduxStore/app/app.reducer";
import { ViolationsSelectors } from "@/reduxStore/violations/violations";

const getViolationsStateSummaryFetchFn = (
  doDedupe: boolean,
  opts: ToQueryViolationFieldMatchQueryArgs
) => {
  const fieldMatchQuery = toQueryViolationFieldMatchQuery({
    appId: opts.appId,
    scanId: opts.scanId,
    stateIds: [],
    checkedFilters: opts.checkedFilters,
    wcagFilters: opts.wcagFilters ?? [],
    overrideFieldMatchQuery: [
      {
        field: "manualTestResult",
        value: ManualTestResult.fail,
      },
      ...(opts.overrideFieldMatchQuery ?? []),
    ],
  });
  return () =>
    Api.post<unknown, ApiStateSummary>("/state-summary", {
      // remove key if doDedupe is nullish
      useDedup: !doDedupe ? undefined : true,
      fieldMatchQuery,
    });
};

const getFetchFn = (
  dedupe: boolean,
  opts: ToQueryViolationFieldMatchQueryArgs
) => {
  const dataFetcher = getViolationsStateSummaryFetchFn(dedupe, opts);
  return async () => {
    const data = await dataFetcher();
    const stateSummaryFlat: StateSummaryFlat[] = [];
    Object.keys(data).forEach((url) => {
      const urlKey = url as keyof typeof data;
      const states = Object.keys(data[urlKey]).map((stateId) => {
        const stateIdKey = stateId as keyof (typeof data)[typeof urlKey];
        return {
          url,
          stateId,
          // @ts-ignore
          violationsCount: data[urlKey][stateIdKey].violationCount,
          // @ts-ignore
          eventSequence: data[urlKey][stateIdKey].eventSequence,
        };
      });

      stateSummaryFlat.push({
        url,
        totalViolations: states.reduce(
          (acc, curr) => acc + curr.violationsCount,
          0
        ),
        totalStates: states.length,
        states,
      });
    });
    const scanStatusResult = await getScanStatus(opts.scanId ?? "");

    const urlErrors = scanStatusResult.urlErrors ?? [];

    urlErrors.forEach((urlError: UrlError) => {
      // find and add error in state summary
      const index = stateSummaryFlat.findIndex(
        (stateSummary) => stateSummary.url === urlError.url
      );
      if (index !== -1) {
        stateSummaryFlat[index].error = urlError;
      }
    });

    const stateErrors = scanStatusResult.stateErrors ?? [];

    for (let i = 0; i < stateSummaryFlat.length; i++) {
      for (let j = 0; j < stateSummaryFlat[i].states.length; j++) {
        const stateError = stateErrors.find(
          (stateError) =>
            stateError.stateId === stateSummaryFlat[i].states[j].stateId
        );

        if (stateError) {
          stateSummaryFlat[i].states[j].error = stateError;
        }
      }
    }

    return stateSummaryFlat;
  };
};

interface StateSummaryState {
  url: string;
  stateId: string;
  violationsCount: number;
  eventSequence: string[];
  error?: StateError;
}

export interface StateSummaryFlat {
  url: string;
  totalViolations: number;
  totalStates: number;
  states: StateSummaryState[];
  error?: UrlError;
}

export const useSelectedAppViolationsStateSummary = ({
  clientTextSearch,
}: {
  clientTextSearch?: string;
}) => {
  const appId = useSelector(selectApplicationInfo)?.appId ?? "";
  const scanId = useSelector(selectSelectedScan)?.id ?? "";
  const checkedFilters = useViolationsCheckedFilters();
  const [doDedupe] = useViolationsDoDeduplicate();
  const selectedWcagFilters = useSelector(
    ViolationsSelectors.selectSelectedWcagFilters
  );

  const opts: ToQueryViolationFieldMatchQueryArgs = {
    appId,
    scanId,
    stateIds: [],
    checkedFilters,
    wcagFilters: selectedWcagFilters,
  };

  const queryResult = useQuery({
    queryKey: QueryKeys.stateSummary(doDedupe, opts),
    queryFn: getFetchFn(doDedupe, opts),
    select: (data) => {
      return data.filter((item) => {
        if (clientTextSearch) {
          return item.url
            .toLocaleLowerCase()
            .includes(clientTextSearch.toLocaleLowerCase());
        }
        return true;
      });
    },
  });

  return queryResult;
};
