import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "@/api";
import {
  ApiAsset,
  ApiEditPassword,
  ApiOrganisation,
  ApiUser,
} from "./settings-api";

export const createEditorganisation = (organisation: ApiOrganisation) => {
  const { _id, ...newOrganisation } = organisation;
  let body = {};
  if (_id === "") {
    body = {
      organisation: newOrganisation,
    };
  } else {
    body = {
      organisation,
    };
  }

  return Api.post<unknown, ApiOrganisation>("/org", body);
};

const fetchOrganisationByIdFn = (id: string | null) => {
  return () => Api.get<unknown, ApiOrganisation>(`/org/${id}`);
};

export const useOrganisationById = (id: string | null) => {
  const queryRes = useQuery<ApiOrganisation>({
    queryKey: ["organisationById", id],
    queryFn: fetchOrganisationByIdFn(id),
    enabled: !!id && id !== "",
  });
  return queryRes;
};

export type QueryOrgResult = {
  result: ApiOrganisation[];
  totalCount: number;
};

const fetchOrganisationFn = (appId: string | null) => {
  return () => Api.get<unknown, QueryOrgResult>("/org", { params: { appId } });
};

export const useOrganisation = (appId: string | null) => {
  const queryRes = useQuery<QueryOrgResult>({
    queryKey: ["organisation", appId],
    queryFn: fetchOrganisationFn(appId),
    enabled: !!appId && appId !== "",
  });
  return queryRes;
};

export const createEditAsset = (asset: ApiAsset) => {
  const { _id, ...newAsset } = asset;
  let body = {};
  if (_id === "") {
    body = {
      asset: newAsset,
    };
  } else {
    body = {
      asset,
    };
  }

  return Api.post<unknown, ApiAsset>("/assets", body);
};

export const useCreateEditAsset = () => {
  const queryClient = useQueryClient();
  return useMutation(createEditAsset, {
    onSuccess: () => {
      queryClient.invalidateQueries(["asset"]);
    },
  });
};

const fetchAssetByIdFn = (id: string | null) => {
  return () => Api.get<unknown, ApiAsset>(`/assets/${id}`);
};

export const useAssetById = (id: string | null) => {
  const queryRes = useQuery<ApiAsset>({
    queryKey: ["AssetById", id],
    queryFn: fetchAssetByIdFn(id),
    enabled: !!id && id !== "",
  });
  return queryRes;
};

export type QueryAssetResult = {
  result: ApiAsset[];
  totalCount: number;
};

const fetchAssetFn = () => {
  return () => Api.get<unknown, QueryAssetResult>("/assets");
};

export const useAsset = () => {
  const queryRes = useQuery<QueryAssetResult>({
    queryKey: ["asset"],
    queryFn: fetchAssetFn(),
  });
  return queryRes;
};

export const deleteAsset = (id: string) => {
  return Api.delete<unknown>(`/assets/${id}`);
};

export const useDeleteAsset = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteAsset, {
    onSuccess: () => {
      queryClient.invalidateQueries(["asset"]);
    },
  });
};

export const createEditUser = (user: ApiUser | ApiEditPassword) => {
  const { _id, ...newUser } = user;
  let body = {};
  if (_id === "") {
    body = {
      user: newUser,
    };
  } else {
    body = {
      user,
    };
  }

  return Api.post<unknown, ApiUser>("/auth/register", body);
};

export const useCreateEditUser = () => {
  const queryClient = useQueryClient();
  return useMutation(createEditUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(["orgUser"]);
    },
  });
};

const fetchUserByIdFn = (id: string | null) => {
  return () => Api.get<unknown, ApiUser>(`/user/${id}`);
};

export const useUserById = (id: string | null) => {
  const queryRes = useQuery<ApiUser>({
    queryKey: ["userById", id],
    queryFn: fetchUserByIdFn(id),
    enabled: !!id && id !== "",
  });
  return queryRes;
};

export type QueryUserResult = {
  result: ApiUser[];
  totalCount: number;
};

const fetchUserFn = () => {
  return () => Api.get<unknown, QueryUserResult>("/user");
};

export const useOrgUser = (orgId: string | undefined) => {
  const queryRes = useQuery<QueryUserResult>({
    queryKey: ["orgUser", orgId],
    queryFn: fetchUserFn(),
  });
  return queryRes;
};

export const deleteUser = (id: string) => {
  return Api.delete<unknown>(`/user/${id}`);
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(["orgUser"]);
    },
  });
};
