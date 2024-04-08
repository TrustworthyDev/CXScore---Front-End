import {
  InfiniteData,
  QueryObserverResult,
  useQuery,
} from "@tanstack/react-query";

import {
  getAppPerfOverview,
  getGuidedValidationData,
  getPerfScanDetails,
  getPerfScansData,
  getPerfViolations,
  getRuleData,
  getScannedData,
  getScansData,
  getSchedulerDetailData,
  getSequenceDetail,
  getSequenceList,
  getStaticUrlListData,
  getUrlPerfScans,
  getUrlPerfScansDetail,
  getVNCTunnels,
} from ".";

export type UseInfiniteQueryResult<T = unknown> = {
  isLoading: boolean;
  isDataInitialized?: boolean;
  error: Error | string | null;
  fetchNextPage: () => void;
  hasNextPage?: boolean;
  isFetching: boolean;
  isFetchingNextPage?: boolean;
  refetch: () => Promise<QueryObserverResult<InfiniteData<T>, Error>>;
};

export const useGuidedValidationData = (appName: string) => {
  const { isLoading, data, isError, refetch } = useQuery<
    {
      result: ApiViolation[];
      totalCount: number;
    },
    Error
  >({
    queryKey: ["GuidedValidationData", appName],
    queryFn: () => getGuidedValidationData(appName),
    enabled: !!appName && appName !== "",
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
};

export const useScansData = (
  appId: string,
): {
  data?: ApiScan[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
} => {
  const { isLoading, data, isError, refetch } = useQuery<ApiScan[], Error>({
    queryKey: ["ScansData", appId],
    queryFn: () => getScansData(appId),
    enabled: !!appId && appId !== "",
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
};

export const useRulesData = (): {
  data?: ApiRuleMeta[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
} => {
  const { isLoading, data, isError, refetch } = useQuery<ApiRuleMeta[], Error>({
    queryKey: [],
    queryFn: () => getRuleData(),
    refetchOnWindowFocus: false,
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
};

export const useSchedulerData = (
  appId: string,
): {
  data?: ApiScheduler[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
} => {
  const { isLoading, data, isError, refetch } = useQuery<ApiScheduler[], Error>(
    {
      queryKey: ["SchedulerData", appId],
      queryFn: () => getSchedulerDetailData(appId),
      enabled: !!appId && appId !== "",
    },
  );

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
};

export const useScannedUrlData = (
  appId: string,
): {
  data?: any;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
} => {
  const res = useQuery<any, Error>({
    queryKey: ["ScannedUrlList", appId],
    queryFn: () => getScannedData(appId),
    enabled: !!appId && appId !== "",
  });

  const { isLoading, data, isError, refetch } = res;

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
};

export const useStaticUrlListData = (
  appId: string,
): {
  data?: any;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
} => {
  const res = useQuery<any, Error>({
    queryKey: ["StaticUrlList", appId],
    queryFn: () => getStaticUrlListData(appId),
    enabled: !!appId && appId !== "",
  });
  const { isLoading, data, isError, refetch } = res;

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
};

export const useVNCTunnelsData = (): {
  data?: ApiTunnel[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
} => {
  const res = useQuery<any, Error>({
    queryKey: ["StaticUrlList"],
    queryFn: () => getVNCTunnels(),
  });
  const { isLoading, data, isError, refetch } = res;

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
};

export const useSequenceData = (): {
  data?: ApiSequenceDetail[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
} => {
  const { isLoading, data, isError, refetch } = useQuery<
    ApiSequenceDetail[],
    Error
  >({
    queryKey: ["SequenceData"],
    queryFn: () => getSequenceList(),
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
};

export const useSequenceDetail = ({
  seqId,
}: {
  seqId: string;
}): {
  data?: ApiSequenceDetail;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
} => {
  const { isLoading, data, isError, refetch } = useQuery<
    ApiSequenceDetail,
    Error
  >({
    queryKey: ["SequenceDetail"],
    queryFn: () => getSequenceDetail({ seqId }),
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
};

export const usePerfScanDetail = ({
  scanId,
}: {
  scanId: string;
}): {
  data?: ApiPerfScan;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
} => {
  const { isLoading, data, isError, refetch } = useQuery<ApiPerfScan, Error>({
    queryKey: ["PerformanceScanDetail", scanId],
    queryFn: () => getPerfScanDetails({ scanId }),
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
};

export const useAppPerfOverview = ({
  appId,
}: {
  appId: string;
}): {
  data?: ApiAppPerfOverview;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
} => {
  const { isLoading, data, isError, refetch } = useQuery<
    ApiAppPerfOverview,
    Error
  >({
    queryKey: ["AppPerformanceOverview"],
    queryFn: () => getAppPerfOverview({ appId }),
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
};

export const usePerfUrlScans = ({
  appId,
  url,
}: {
  appId: string;
  url: string;
}): {
  data?: ApiScan[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
} => {
  const { isLoading, data, isError, refetch } = useQuery<ApiScan[], Error>({
    queryKey: ["PerformanceUrlScans", appId, url],
    queryFn: () => getUrlPerfScans({ appId, url }),
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
};

export const usePerfScansData = (
  appId: string,
): {
  data?: ApiScan[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
} => {
  const { isLoading, data, isError, refetch } = useQuery<ApiScan[], Error>({
    queryKey: ["PerfScansData", appId],
    queryFn: () => getPerfScansData(appId),
    enabled: !!appId && appId !== "",
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
};
export const usePerfUrlScansDetail = ({
  appId,
  url,
}: {
  appId: string;
  url: string;
}): {
  data?: PerfScanDetail[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
} => {
  const { isLoading, data, isError, refetch } = useQuery<
    PerfScanDetail[],
    Error
  >({
    queryKey: ["PerformanceUrlScansDetail", appId, url],
    queryFn: () =>
      appId === "" || url === "" ? [] : getUrlPerfScansDetail({ appId, url }),
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
};

export const usePerfViolations = ({
  scanId,
}: {
  scanId: string;
}): {
  data?: ApiPerfViolation[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
} => {
  const { isLoading, data, isError, refetch } = useQuery<
    ApiPerfViolation[],
    Error
  >({
    queryKey: ["PerfViolations", scanId],
    queryFn: () => (scanId === "" ? [] : getPerfViolations({ scanId })),
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
};
