import { Api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../lookup/query-keys";

const getFetchDiscoveryFn =
  (opts: { appId?: string; scanId?: string; queryAllScans: boolean }) =>
  async () => {
    let query = "";

    const { appId, scanId } = opts;

    if (scanId) {
      query = `scanId=${scanId}`;
    } else if (appId) {
      query = `scanId=${appId}`;
    } else {
      throw new Error("Either scanId or appId must be provided");
    }

    if (opts.queryAllScans) {
      query = query + "&allScans=true";
    }

    return Api.get<unknown, ApiAppSummary>(`/app-summary?${query}`);
  };

export const useDiscoveryByScanId = ({
  scanId,
  queryAllScans = false,
}: {
  scanId: string;
  queryAllScans: boolean;
}) => {
  const queryResult = useQuery({
    queryKey: QueryKeys.discoveryByScanId(scanId),
    queryFn: getFetchDiscoveryFn({
      scanId,
      queryAllScans,
    }),
    enabled: scanId !== "",
  });

  return queryResult;
};

const getFetchHealthScoreFn = (opts: { scanId?: string }) => async () => {
  return Api.get<unknown, ApiScanResultStatus>(
    `/scan-result/${opts.scanId}?output=status`
  );
};

export const useHealthScoreByScanId = ({ scanId }: { scanId: string }) => {
  const queryResult = useQuery({
    queryKey: QueryKeys.healthScoreByScanId(scanId),
    queryFn: getFetchHealthScoreFn({
      scanId,
    }),
    enabled: scanId !== "",
  });

  return queryResult;
};