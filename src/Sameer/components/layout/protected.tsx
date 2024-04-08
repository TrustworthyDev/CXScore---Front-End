import { Layout } from ".";
import { Navigate } from "react-router-dom";
// import { selectAuthToken } from "@/reduxStore/app/app.reducer";
import { getAccessToken, useUser } from "../../lib/application/use-login";
import { useEffect } from "react";

export const ProtectedLayout = (props: any) => {
  const user = useUser();
  // const authToken = useSelector(selectAuthToken) ?? "";
  useEffect(() => {
    const id = setInterval(() => {
      if (!getAccessToken()) {
        window.location.assign("/login");
      }
    }, 5000);
    return () => {
      clearInterval(id);
    };
  }, []);

  // if (!authToken) {
  if (!getAccessToken() || user.data?.name === "cxsreport") {
    return <Navigate to="/login" />;
  }

  return <Layout {...props} />;
};
