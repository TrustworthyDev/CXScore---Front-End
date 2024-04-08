import React, { useEffect, useState } from "react";
import ReportView from "./ReportView";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  onChangeApplication,
  onChangeSelectedScan,
} from "@/reduxStore/app/app.actions";
import { useSelectedAppId } from "../../../Sameer/lib/application/use-application-data";
import { useScansData } from "@/api/useRequest";
import { extractQueryParams } from "../../utils/common.utils";

const ReportComponent: React.FC = () => {
  const dispatch = useDispatch();
  const selectedAppId = useSelectedAppId();
  const scansQuery = useScansData(selectedAppId ?? "");

  const location = useLocation();
  const handleChangeApplication = (queryParams: any) => {
    dispatch(
      onChangeApplication({
        appInfo: {
          appId: queryParams.appId,
          appName: queryParams.appName,
        },
      })
    );
  };

  const handleScanSelection = (queryParams: any) => {
    const result = scansQuery?.data?.find(
      (scan) => scan.id === queryParams.scanId
    );

    if (result) {
      dispatch(
        onChangeSelectedScan({
          scan: result,
        })
      );
    }
  };

  useEffect(() => {
    const queryParams = extractQueryParams(location.search);

    handleChangeApplication(queryParams);
  }, [location.search]);

  useEffect(() => {
    const queryParams = extractQueryParams(location.search);
    handleScanSelection(queryParams);
  }, [location.search, scansQuery.data]);

  return <ReportView />;
};

export default ReportComponent;
