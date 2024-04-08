// import { onChangeAuthToken } from "@/reduxStore/app/app.actions";
// import { useDispatch } from "react-redux";
import { Api, cxscoreApiUrl } from "@/api";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { QueryKeys } from "../../lookup/query-keys";

type LoginArgs = { user: string; password: string };

const loginFn = (payload: LoginArgs) => {
  return axios.post(`${cxscoreApiUrl}/auth/login`, {
    ...payload,
  });
};

export const ACCESSTOKEN_KEY = "api/accesstoken" as const;

export const useLoginRequest = () => {
  const [isLoading, setLoading] = useState(false);

  const login = useCallback(
    async (payload: LoginArgs) => {
      setLoading(true);
      try {
        const response = await loginFn(payload);
        // TODO: storing accesstoken in local storage is not a good idea
        localStorage.setItem(ACCESSTOKEN_KEY, response.data.token);
        return response.data.token as string;
      } catch (error) {
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  return {
    isLoading,
    login,
  };
};

const logout = () => {
  localStorage.removeItem(ACCESSTOKEN_KEY);
  window.location.assign("/login");
};

export const useLogout = () => {
  // const dispatch = useDispatch();

  // const logout = useCallback(() => {
  // dispatch(
  //   onChangeAuthToken({
  //     token: "",
  //   })
  // );
  // }, [dispatch]);

  return { logout };
};

const fetchUserProfileFn = () => {
  return Api.get<unknown, ApiCurrentUser>("/current-user");
};

const checkReportPermissionFn = () => {
  return Api.get<unknown, ApiReportPermission>(
    "/check-permission?action=api/sales-report"
  );
};

export const useUser = () => {
  const queryResult = useQuery({
    queryFn: fetchUserProfileFn,
    queryKey: QueryKeys.user(),
    enabled: true,
  });

  return queryResult;
};

export const useCheckReportPermission = () => {
  const queryResult = useQuery({
    queryFn: checkReportPermissionFn,
    queryKey: QueryKeys.reportPermission(),
    enabled: true,
  });

  return queryResult;
};

export const getAccessToken = () => {
  return localStorage.getItem(ACCESSTOKEN_KEY);
};

export const useAuth = () => {
  const getIsLoggedIn = useCallback(() => {
    return !!getAccessToken();
  }, []);

  return {
    getIsLoggedIn,
  };
};
