import React, { useState } from "react";
import { Button } from "@/atoms";
import { useSelectedAppInfo } from "../../../../lib/application/use-application-data";
import { useSelector } from "react-redux";
import { selectSelectedScan } from "@/reduxStore/app/app.reducer";
import { useUser } from "../../../../lib/application/use-login";
import { UploadInput } from "@/atoms/UploadInput";

export interface SRViolations {
  [key: string]: string;
}

export interface ReportCsvData {
  healthPercentage: number;
  verdict: string;
  companyLogo: string;
}

const ViewReport = () => {
  const user = useUser();
  const selectedApp = useSelectedAppInfo();
  const selectedScanId = useSelector(selectSelectedScan)?.id ?? "";
  const [parsedData, setParsedData] = useState<ReportCsvData>();

  const handleCSVFile = (file: File | undefined) => {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const contents = event.target?.result as string;
      const lines = contents.split("\n");
      const headers = lines[0].split(",");
      let healthPercentage = 35;
      let verdict = "Non-Compliant";
      let companyLogo = "";

      for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].split(",");
        if (currentLine.length === headers.length) {
          healthPercentage = Number(currentLine[0]);
          verdict = currentLine[1];
          companyLogo = currentLine[2];
        }
      }
      const data: ReportCsvData = {
        healthPercentage,
        verdict,
        companyLogo,
      };

      setParsedData(data);
    };
    reader.readAsText(file);
  };

  const redirectToReportPage = () => {
    const queryParams = new URLSearchParams({
      appId: selectedApp?.appId ?? "",
      scanId: selectedScanId,
      appName: selectedApp?.appName ?? "",
      parsedData: JSON.stringify(parsedData),
    });

    const url = `/reports?${queryParams.toString()}`;
    window.open(url, "_blank");
  };

  return user?.data?.name === "cxsdemo" ? (
    <div className="flex">
      <div className="pr-4">
        <Button onClick={() => redirectToReportPage()}>View Report</Button>
      </div>
      <UploadInput onChangeFile={handleCSVFile} accept=".csv" />
    </div>
  ) : null;
};

export default ViewReport;
