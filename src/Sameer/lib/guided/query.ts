import {
  selectApplicationInfo,
  selectSelectedScan,
} from "@/reduxStore/app/app.reducer";
import { useSelector } from "react-redux";
import { ViolationsAllPossibleFilters } from "../violations/count";
import {
  UseQueryViolationUseHookFlags,
  QueryViolationFetchArgs,
  ToQueryViolationFieldMatchQueryArgs,
  ToQueryViolationOutputArgs,
  useQueryViolation,
} from "../violations/query";
import { useGuidedCheckedFilters } from "./count";
import { useGuidedDoDeduplicate } from "./dedupe";
import { GuidedSelectors } from "@/reduxStore/guided/guided";

export type UseGuidedArgs = {
  useHookFlags?: Omit<UseQueryViolationUseHookFlags, "useSelectedStateIds">; // decide whether to use from global state
} & QueryViolationFetchArgs;

export const useQueryViolationArgsForGuided = (args: UseGuidedArgs) => {
  const selectedAppId = useSelector(selectApplicationInfo)?.appId ?? "";
  const selectedScanId = useSelector(selectSelectedScan)?.id ?? "";
  const checkedFilters = useGuidedCheckedFilters();
  const [doDeDuplicate] = useGuidedDoDeduplicate();
  const wcagFilters = useSelector(GuidedSelectors.selectSelectedWcagFilters);

  const { outputOpts, fieldMatchQueryOpts, useHookFlags } = args;

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

  const finalFieldMatchQueryArgs: ToQueryViolationFieldMatchQueryArgs = {
    ...fieldMatchQueryOpts,
    type: "guided",
    appId: useSelectedAppId ? selectedAppId : fieldMatchQueryOpts?.appId,
    scanId: useSelectedScanId ? selectedScanId : fieldMatchQueryOpts?.scanId,
    stateIds: fieldMatchQueryOpts?.stateIds ?? [],
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

export const useGuided = (args: UseGuidedArgs) => {
  const { fieldMatchQueryOpts, outputOpts } =
    useQueryViolationArgsForGuided(args);

  const queryResult = useQueryViolation({
    ...args,
    fieldMatchQueryOpts,
    outputOpts,
  });

  return queryResult;
};

