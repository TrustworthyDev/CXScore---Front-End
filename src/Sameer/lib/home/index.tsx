import { useCountViolationForViolations } from "../violations/count";
import { ManualTestResult } from "@/types/enum";
import { useMemo } from "react";
import { useCountViolationForGuided } from "../guided/count";

export const usePassFailResults = () => {
  const queryResult = useCountViolationForViolations({
    countByFields: ["manualTestResult"],
    useHookFlags: {
      useSelectedAppId: true,
      useSelectedScanId: true,
      useSelectedStateIds: false,
      useDoDeDuplicate: false,
      useCheckedFilters: false,
      useWcagFilters: false,
    },
    fieldMatchQueryOpts: {
      type: "all",
    },
  });

  const selected = useMemo(() => {
    const manualTestResultData =
      queryResult.data?.find((item) => item.field === "manualTestResult") ??
      null;

    if (manualTestResultData === null) {
      return {
        pass: 0,
        passPercentage: 0,
        fail: 0,
        failPercentage: 0,
        pending: 0,
        pendingPercentage: 0,
        total: 0,
      };
    }

    const passCount =
      manualTestResultData?.values?.find(
        (item) => item.value === ManualTestResult.pass
      )?.count ?? 0;

    const failCount =
      manualTestResultData?.values?.find(
        (item) => item.value === ManualTestResult.fail
      )?.count ?? 0;

    const pendingCount =
      manualTestResultData?.values?.find(
        (item) => item.value === ManualTestResult.pending
      )?.count ?? 0;

    const total = passCount + failCount + pendingCount;

    return {
      pass: passCount,
      passPercentage: (passCount / total) * 100,
      fail: failCount,
      failPercentage: (failCount / total) * 100,
      pending: pendingCount,
      pendingPercentage: (pendingCount / total) * 100,
      total: total,
    };
  }, [queryResult.data]);

  return { ...queryResult, data: selected };
};

export const useGuidedValidationTestResults = () => {
  const queryResult = useCountViolationForGuided({
    countByFields: ["manualTestResult"],
    useHookFlags: {
      useSelectedAppId: true,
      useSelectedScanId: true,
      useSelectedStateIds: false,
      useDoDeDuplicate: false,
      useCheckedFilters: false,
      useWcagFilters: false,
    },
  });

  const selected = useMemo(() => {
    const manualTestResultData =
      queryResult.data?.find((item) => item.field === "manualTestResult") ??
      null;

    if (manualTestResultData === null) {
      return {
        testedAndConfirmed: 0,
        testedAndConfirmedPercentage: 0,
        pending: 0,
        pendingPercentage: 0,
        total: 0,
      };
    }

    const passCount =
      manualTestResultData?.values?.find(
        (item) => item.value === ManualTestResult.pass
      )?.count ?? 0;

    const failCount =
      manualTestResultData?.values?.find(
        (item) => item.value === ManualTestResult.fail
      )?.count ?? 0;

    const testedAndConfirmedCount = passCount + failCount;

    const pendingCount =
      manualTestResultData?.values?.find(
        (item) => item.value === ManualTestResult.pending
      )?.count ?? 0;

    const total = passCount + failCount + pendingCount;

    return {
      testedAndConfirmed: testedAndConfirmedCount,
      testedAndConfirmedPercentage: (testedAndConfirmedCount / total) * 100,
      pending: pendingCount,
      pendingPercentage: (pendingCount / total) * 100,
      total: total,
    };
  }, [queryResult.data]);

  return { ...queryResult, data: selected };
};

export const useDetailLevelResults = () => {
  const queryResult = useCountViolationForViolations({
    countByFields: ["rule.detailLevel"],
    useHookFlags: {
      useSelectedAppId: true,
      useSelectedScanId: true,
      useSelectedStateIds: false,
      useDoDeDuplicate: false,
      useCheckedFilters: false,
      useWcagFilters: false,
    },
    fieldMatchQueryOpts: {
      type: "violation",
    },
  });

  const selected = useMemo(() => {
    const detailLevelData =
      queryResult.data?.find((item) => item.field === "rule.detailLevel") ??
      null;

    if (detailLevelData === null) {
      return {
        A: 0,
        AA: 0,
      };
    }

    const A =
      detailLevelData?.values?.find((item) => item.value === "A")?.count ?? 0;

    const AA =
      detailLevelData?.values?.find((item) => item.value === "AA")?.count ?? 0;

    return {
      A: A,
      AA: AA,
    };
  }, [queryResult.data]);

  return { ...queryResult, data: selected };
};

export const IssueCategoryKeys = [
  "Screen Reader",
  "Audio & Video",
  "RWD",
  "Color Contrast",
  "Structure & Layout",
  "Keyboard",
  "User Controls",
] as const;

export const useIssueCategoryViolationResults = () => {
  const queryResult = useCountViolationForViolations({
    countByFields: ["issueCategory"],
    useHookFlags: {
      useSelectedAppId: true,
      useSelectedScanId: true,
      useSelectedStateIds: false,
      useDoDeDuplicate: false,
      useCheckedFilters: false,
      useWcagFilters: false,
    },
  });

  const selected = useMemo(() => {
    const r =
      queryResult.data?.find((item) => item.field === "issueCategory") ?? null;

    const keys = IssueCategoryKeys;

    if (r === null) {
      return keys.reduce((acc, key) => {
        acc[key] = 0;
        return acc;
      }, {} as Record<(typeof keys)[number], number>);
    }

    return keys.reduce((acc, key) => {
      acc[key] = r?.values?.find((item) => item.value === key)?.count ?? 0;
      return acc;
    }, {} as Record<(typeof keys)[number], number>);
  }, [queryResult.data]);

  return { ...queryResult, data: selected };
};

export const useViolationBySeverityResults = () => {
  const queryResult = useCountViolationForViolations({
    countByFields: ["severity"],
    useHookFlags: {
      useSelectedAppId: true,
      useSelectedScanId: true,
      useSelectedStateIds: false,
      useDoDeDuplicate: false,
      useCheckedFilters: false,
      useWcagFilters: false,
    },
  });

  const selected = useMemo(() => {
    const r =
      queryResult.data?.find((item) => item.field === "severity") ?? null;

    const keys = ["Moderate", "Serious", "Critical", "Minor"] as const;

    if (r === null) {
      return {
        total: 0,
        ...keys.reduce((acc, key) => {
          acc[key] = 0;
          return acc;
        }, {} as Record<(typeof keys)[number], number>),
      };
    }

    const keyCounts = keys.reduce((acc, key) => {
      acc[key] =
        r?.values?.find(
          (item) => item.value.toLocaleLowerCase() === key.toLocaleLowerCase()
        )?.count ?? 0;
      return acc;
    }, {} as Record<(typeof keys)[number], number>);

    const total = Object.values(keyCounts).reduce((acc, count) => {
      return acc + count;
    }, 0);

    return {
      total,
      ...keyCounts,
    };
  }, [queryResult.data]);

  return { ...queryResult, data: selected };
};

export const useViolationByPrincipalResults = () => {
  const queryResult = useCountViolationForViolations({
    countByFields: ["rule.detailPrinciples"],
    useHookFlags: {
      useSelectedAppId: true,
      useSelectedScanId: true,
      useSelectedStateIds: false,
      useDoDeDuplicate: false,
      useCheckedFilters: false,
      useWcagFilters: false,
    },
  });

  const selected = useMemo(() => {
    const r =
      queryResult.data?.find(
        (item) => item.field === "rule.detailPrinciples"
      ) ?? null;

    const keys = [
      "Perceivable",
      "Operable",
      "Understandable",
      "Robust",
    ] as const;

    if (r === null) {
      return {
        total: 0,
        ...keys.reduce((acc, key) => {
          acc[key] = 0;
          return acc;
        }, {} as Record<(typeof keys)[number], number>),
      };
    }

    const keyCounts = keys.reduce((acc, key) => {
      const totalCount =
        r?.values
          ?.filter(
            (item) => item.value.toLocaleLowerCase() === key.toLocaleLowerCase()
          )
          .reduce((acc, item) => {
            return acc + item.count;
          }, 0) ?? 0;

      acc[key] = totalCount;
      return acc;
    }, {} as Record<(typeof keys)[number], number>);

    const total = Object.values(keyCounts).reduce((acc, count) => {
      return acc + count;
    }, 0);

    return {
      total,
      ...keyCounts,
    };
  }, [queryResult.data]);

  return { ...queryResult, data: selected };
};
