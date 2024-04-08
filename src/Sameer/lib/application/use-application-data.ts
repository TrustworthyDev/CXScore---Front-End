import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../lookup/query-keys";

import { useSelector } from "react-redux";
import { selectApplicationInfo } from "@/reduxStore/app/app.reducer";
import { Api, cxscoreApiUrl } from "@/api";

const getApplicationsFetchFn = () => {
  return () => Api.get<unknown, ApiApplicationInfo[]>(`application`);
};

const getApplicationByIdFetchFn = (appId: string) => {
  return () => Api.get<unknown, ApiApplicationInfo>(`/application/${appId}`);
};

export const useApplicationData = (args: { appId: string }) => {
  const query = useQuery({
    queryKey: QueryKeys.application(args.appId),
    queryFn: getApplicationByIdFetchFn(args.appId),
    enabled: args.appId !== "",
    refetchOnWindowFocus: false,
  });

  return query;
};

export const useAllApplicationData = () => {
  const query = useQuery({
    queryKey: QueryKeys.application("all"),
    queryFn: getApplicationsFetchFn(),
    // sort by recent scan using: lastScan
    select: (data) =>
      !!data
        ? data.sort(
            (a, b) =>
              new Date(b.lastScan).getTime() - new Date(a.lastScan).getTime()
          )
        : [],
    refetchOnWindowFocus: false,
  });

  return query;
};

export const useSelectedApplicationData = () => {
  const selectedAppIdFromStore = useSelector(selectApplicationInfo)?.appId;

  const query = useApplicationData({ appId: selectedAppIdFromStore ?? "" });

  return { ...query };
};

export const useSelectedAppId = () => {
  const selectedAppIdFromStore =
    useSelector(selectApplicationInfo)?.appId ?? null;

  return selectedAppIdFromStore;
};

export const useSelectedAppInfo = () => {
  const selectedAppFromStore = useSelector(selectApplicationInfo);

  return selectedAppFromStore;
};
