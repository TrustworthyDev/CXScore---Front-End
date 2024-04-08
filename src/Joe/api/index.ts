import axios, { InternalAxiosRequestConfig } from "axios";

import { ManualTestResult } from "@/types/enum";

import { ACCESSTOKEN_KEY } from "../../Sameer/lib/application/use-login";
import { DynamicFilter } from "../../Sameer/lib/violations/query";
import { useQuery } from "@tanstack/react-query";

export const cxscoreApiUrl = import.meta.env.VITE_API_URL;

export const Api = axios.create({
  baseURL: `${cxscoreApiUrl}`,
});

Api.interceptors.request.use(
  async (request): Promise<InternalAxiosRequestConfig> => {
    // const authToken =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhY2Nlc3Nib3QuaW8iLCJpYXQiOjE2NjUzNTUxOTF9.cFwegyUP8C6RCOVLw027Q3NMT_S-lRq2pv-GvkZhr9s";
    const authToken = localStorage.getItem(ACCESSTOKEN_KEY);

    request.headers.Authorization = `Bearer ${authToken}`;
    return { ...request };
  },
);

Api.interceptors.response.use(async (response) => {
  const { data } = response;
  const result = data?.result ?? data?.data ?? data.output ?? data;
  const error = data?.error;

  if (data.scans) {
    return data.scans;
  }
  // for /query-violation API
  if (data.totalCount != null && data.result != null) {
    return Promise.resolve({
      result: data.result,
      totalCount: data.totalCount,
    });
  }
  if (data.error) {
    return Promise.reject(error);
  }
  return data.status === "ok" ? Promise.resolve(result) : data;
});

export const getGuidedValidationStatusData =
  (): Promise<ApiGuidedValidationData> =>
    new Promise((resolve) => setTimeout(resolve, 1000)).then(() => ({
      statusHistory: [
        { completed: 50, pending: 5 },
        { completed: 100, pending: 20 },
        { completed: 100, pending: 75 },
        { completed: 40, pending: 45 },
        { completed: 47, pending: 95 },
      ],
    }));

export const getCurrentGuidedValidationStatus = (
  appName: string,
): Promise<[ApiCountByTicketStatusData]> =>
  Api.post<unknown, [ApiCountByTicketStatusData]>("count-violation", {
    fieldMatchQuery: [
      {
        field: "application.name",
        value: appName,
      },
      {
        field: "type",
        value: "guided_test",
      },
    ],
    countByField: ["ticketStatus"],
  });

export const getRuleData = (): Promise<ApiRuleMeta[]> =>
  Api.get<unknown, ApiRuleMeta[]>("rule-meta");

export const getRuleByIssueCnt = (
  appName: string,
): Promise<[ApiCountByRuleId]> =>
  Api.post<unknown, [ApiCountByRuleId]>("count-violation", {
    fieldMatchQuery: [
      {
        field: "application.name",
        value: appName,
      },
      {
        field: "type",
        value: "guided_test",
      },
    ],
    countByField: ["ruleId"],
  });

export const getGuidedValidationData = (
  appName: string,
): Promise<{
  result: ApiViolation[];
  totalCount: number;
}> =>
  Api.post<
    unknown,
    {
      result: ApiViolation[];
      totalCount: number;
    }
  >("query-violation", {
    fieldMatchQuery: [
      {
        field: "application.name",
        value: appName,
      },
      {
        field: "type",
        value: "guided_test",
      },
    ],
  });

export const getViolationDetail = (
  violationID: string,
): Promise<ApiViolation> =>
  Api.get<unknown, ApiViolation>(`violation/${violationID}`);

export const getGuidedValidationByFilter = (
  appName = "",
  filterOpts: DynamicFilter[] = [],
): Promise<{
  result: ApiViolation[];
  totalCount: number;
}> =>
  Api.post<
    unknown,
    {
      result: ApiViolation[];
      totalCount: number;
    }
  >("query-violation", {
    fieldMatchQuery: [
      ...(appName
        ? [
            {
              field: "application.name",
              value: appName,
            },
          ]
        : []),
      ...filterOpts,
    ],
  });

export const changeValidationStatus = (
  violationId: string,
  manualTestResult: ManualTestResult,
): Promise<any> =>
  Api.post<unknown, any>(`violation/${violationId}`, {
    manualTestResult,
  });

export const confirmNotViolation = (violationId: string): Promise<any> =>
  Api.post<unknown, any>(`violation/${violationId}`, {
    type: "guided_test",
    manualTestResult: ManualTestResult.pass,
  });

export const getScansData = (appId: string): Promise<ApiScan[]> =>
  Api.get<unknown, ApiScan[]>("scan-status", {
    params: {
      appId,
    },
  });

export const getScannedData = (appId: string): Promise<any> =>
  Api.get<unknown, any>("scanned-url-list", {
    params: {
      applicationId: appId,
    },
  });

export const getStaticUrlListData = (appId: string): Promise<any> =>
  Api.get<unknown, any>("static-url-list", {
    params: {
      applicationId: appId,
    },
  });

export const postStaticUrlListData = (
  appId: string,
  payload: { source: string; urlList: string[] },
): Promise<any> =>
  Api.post<unknown, any>(
    "/static-url-list",
    { source: payload.source, urlList: payload.urlList },
    {
      params: {
        applicationId: appId,
      },
    },
  );

export const submitScanRequest = (
  scanConfig: ScanConfig,
): Promise<{ scanId: string }> =>
  Api.post<unknown, any>("scan", {
    config: scanConfig,
  });

export const submitChromeRRScanRequest = (params: {
  name: string;
  googleRecorderEvents: any;
}): Promise<{
  id: string;
  scanId: string;
}> =>
  Api.post<unknown, any>("google-recorder-events", {
    ...params,
  });

export const cancelScanRequest = (
  scanId: string,
): Promise<{ scanId: string }> =>
  Api.post<unknown, any>("scan-control", {
    scanId,
    op: "cancel",
  });

export const getScanStatus = (scanId: string): Promise<ApiScan> =>
  Api.get<unknown, ApiScan>(`scan-status/${scanId}`);

export const useScanStatus = (scanId: string) => {
  return useQuery({
    queryFn: () => getScanStatus(scanId),
    queryKey: ["scan-status", scanId],
    enabled: !!scanId,
  });
};

export const getAppsByUrl = (url: string): Promise<ApiApplicationInfo[]> =>
  Api.post<unknown, ApiApplicationInfo[]>("query-app", {
    fieldMatchQuery: [
      {
        field: "url",
        match: "domain",
        value: url,
      },
    ],
  });

export const postAddApp = (appName: string): Promise<any> =>
  Api.post<unknown, any>("application", {
    value: {
      name: appName,
      id: appName,
    },
  });

export const updateApp = (
  appId: string,
  appUpdatePayload: Partial<ApiApplicationInfo>,
): Promise<any> =>
  Api.post<unknown, any>(`application/${appId}`, {
    value: {
      ...appUpdatePayload,
    },
  });

export const getUrlSuggestions = (url: string): Promise<string[]> =>
  Api.get<unknown, string[]>(`url-autocomplete?match=${url}`);

export const changeApplicaitonInfo = (
  appId: string,
  changeInfo: ApiApplicationChange,
) =>
  Api.post<unknown, any>(`application/${appId}`, {
    value: changeInfo,
  });

export const getSchedulerData = (appId: string): Promise<ApiScheduler[]> =>
  Api.get<unknown, ApiScheduler[]>("schedule", {
    params: {
      applicationId: appId,
    },
  }).then((data) =>
    data.map((row) => ({
      ...row,
      startDate: new Date(row.startDate),
      endDate: row.endDate === "never" ? "never" : new Date(row.endDate),
    })),
  );

export const getSchedulerDetailData = (
  appId: string,
): Promise<ApiScheduler[]> =>
  Api.get<unknown, ApiScheduler[]>("schedule-detail", {
    params: {
      applicationId: appId,
    },
  }).then((data) =>
    data.map((row) => ({
      ...row,
      startDate: new Date(row.startDate),
      endDate: row.endDate === "never" ? "never" : new Date(row.endDate),
    })),
  );

export const deleteScheduler = (schedulerId: string) =>
  Api.delete<unknown, unknown>(`schedule/${schedulerId}`);

export const addScheduler = (
  scheduleConfig: ScheduleConfig,
): Promise<{ id: string }> =>
  Api.post<unknown, any>("schedule", scheduleConfig);

export const postCreateNewTicket = async ({
  violationIds,
  createIndividualJiraTicket,
}: {
  violationIds?: string[];
  createIndividualJiraTicket?: boolean;
}) =>
  Api.post<unknown, ApiCreateTicketResultItem[]>("/create-ticket", {
    violations: violationIds ?? [],
    createIndividualJiraTicket,
  });

export const updateSchedulerActiveStatus = ({
  schedulerId,
  active,
}: {
  schedulerId: string;
  active: boolean;
}) =>
  Api.post<unknown, any>("schedule", {
    id: schedulerId,
    active,
  });

export const getLatestGraphs = (): Promise<any[]> =>
  Api.get<unknown, ApiScheduler[]>("graph");

export const openDomByDbId = ({
  id,
  index,
}: {
  id: string;
  index: number;
}): Promise<any> => Api.get<unknown, ApiScheduler[]>(`dom-state/${id}`);

export const openGraphId = ({ id }: { id: string }): Promise<any> =>
  Api.get<unknown, ApiScheduler[]>(`graph/${id}`);

export const openVertexById = ({ id }: { id: string }): Promise<any> =>
  Api.get<unknown, ApiScheduler[]>("vertex", {
    params: {
      id,
    },
  });
export const openSnapshotFile = async (index: number) => null;
export const openRawSnapshotFile = async (index: number) => null;
export const openScreenshotFile = async () => null;
export const getVNCTunnels = (): Promise<ApiTunnel[]> =>
  Api.get<unknown, ApiTunnel[]>("vnc-tunnel");

export const createVNCUrl = ({ tunnelId }: { tunnelId: string }) =>
  Api.post<unknown, any>("create-vnc-url", {
    tunnelId,
  });

export const createEventSequence = ({
  name,
  eventSequence,
}: ApiSequenceDetail) =>
  Api.post<unknown, any>("event-sequence", {
    value: {
      name,
      eventSequence,
    },
  });

export const getSequenceList = (): Promise<ApiSequenceDetail[]> =>
  Api.get<unknown, ApiSequenceDetail[]>("event-sequence");

export const getSequenceDetail = ({
  seqId,
}: {
  seqId: string;
}): Promise<ApiSequenceDetail> =>
  Api.get<unknown, ApiSequenceDetail>(`event-sequence/${seqId}`);

export const registerRRProxyServer = ({ targetUrl }: { targetUrl: string }) =>
  Api.post<unknown, unknown>("proxy/register-proxy", {
    targetUrl,
  });

export const getPerfScanDetails = ({ scanId }: { scanId: string }) =>
  Api.get<unknown, ApiPerfScan>("perf/result", {
    params: {
      scanId,
    },
  });
export const getAppPerfOverview = ({ appId }: { appId: string }) =>
  Api.get<unknown, ApiAppPerfOverview>("perf/app", {
    params: { appId },
  });

export const getUrlPerfScans = ({
  appId,
  url,
}: {
  appId: string;
  url: string;
}) =>
  Api.get<unknown, { appId: string; scanList: ApiScan[] }>(
    "perf/getScansHistory",
    {
      params: { appId, url: encodeURI(url) },
    },
  ).then((res) => res.scanList);

export const getPerfScansData = (appId: string): Promise<ApiScan[]> =>
  Api.get<unknown, ApiScan[]>("perf/scan-status", {
    params: {
      appId,
    },
  });

export const getUrlPerfScansDetail = ({
  appId,
  url,
}: {
  appId: string;
  url: string;
}): Promise<PerfScanDetail[]> =>
  Api.get<unknown, PerfScanDetail[]>("perf/getPerfMetrics", {
    params: {
      appId,
      url,
    },
  });

export const getPerfViolations = ({ scanId }: { scanId: string }) =>
  Api.get<unknown, ApiPerfViolation[]>("perf/getViolations", {
    params: {
      scanId,
    },
  });

