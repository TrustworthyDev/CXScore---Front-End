import { useDispatch } from "react-redux";
import {
  getAccessToken,
  useCheckReportPermission,
  useLoginRequest,
} from "../../lib/application/use-login";
import { onChangeAuthToken } from "@/reduxStore/app/app.actions";
import { useQueryClient } from "@tanstack/react-query";
import { GuestLayout } from "./GuestLayout";
import { useEffect } from "react";
import { Loading } from "../atoms/loading";

export const ProtectedGuestLayout = (props: any) => {
  const { login, isLoading } = useLoginRequest();
  const globalDispatch = useDispatch();
  const queryClient = useQueryClient();
  const checkReportPermission = useCheckReportPermission();

  useEffect(() => {
    const guestLogin = async () => {
      const token = await login({
        user: "cxsreport",
        password: "Report@123",
      });
      if (token) {
        globalDispatch(
          onChangeAuthToken({
            token,
          })
        );
        queryClient.resetQueries();
      }
    };
    if (!getAccessToken()) {
      guestLogin();
    }
  }, []);

  if (isLoading) return <Loading />;

  if (checkReportPermission.data?.allowed) return <GuestLayout {...props} />;
  return null;
};
