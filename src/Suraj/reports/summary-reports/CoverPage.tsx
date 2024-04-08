import { AccessibilityIcon } from "@/icons/Accessibility";
import React, { useEffect, useState } from "react";
import images from "~/assets";
import { CXScoreLogo } from "../../../Sameer/components/atoms/logo/cxscore-logo";
import { ReportCsvData } from "../../../Sameer/components/page/common/header-bar/ViewReport";
import HeadingOne from "../../component/common/headings/HeadingOne";
import HeadingTwo from "../../component/common/headings/HeadingTwo";
import { extractQueryParams } from "../../utils/common.utils";
import "./SummaryReport.css";

const PrintTime: React.FC = () => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const getCurrentTime = (): string => {
      const date = new Date();
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };

      const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
        date
      );

      // Add the appropriate suffix to the day
      const day = date.getDate();
      const suffix = getDaySuffix(day);

      return formattedDate.replace(/\b(\d{1,2})\b/, `$1${suffix}`);
    };

    const getDaySuffix = (day: number): string => {
      if (day >= 11 && day <= 13) {
        return "th";
      }

      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    setCurrentTime(getCurrentTime());
  }, []);

  return <HeadingTwo text={currentTime} className="text-[#545454]" />;
};

const CoverPage = () => {
  const queryParams = extractQueryParams(location.search);
  const parsedData: ReportCsvData | undefined = queryParams.parsedData
    ? (JSON.parse(queryParams.parsedData) as ReportCsvData)
    : undefined;
  return (
    <div className="flex min-h-[calc(100vh-5vh)] flex-col justify-between bg-white">
      <header className="mb-60 flex items-center justify-between p-4">
        <CXScoreLogo />
        <div className="text-2xl text-[#1446FF]">
          Let’s make the world <span className="font-bold">equal</span>.
        </div>
      </header>
      <main className="flex flex-grow items-center justify-center">
        <div className="flex flex-col items-center">
          <figure aria-label="client company logo image">
            <img
              src={parsedData?.companyLogo}
              className="companyLogoImage"
              alt="client company logo image"
            />
          </figure>
          {/* <HeadingOne
            text={parsedData?.companyName}
            className="p-6 text-center text-8xl text-[#35ACEF]"
          /> */}
          <HeadingOne
            text="Accessibility Summary Report"
            className="p-4 text-4xl text-[#545454]"
          />

          <div className="flex justify-center">
            <AccessibilityIcon size={350} />
          </div>
        </div>
      </main>
      <div className="m-4 mt-60 flex items-center justify-between">
        <figure aria-label="W3C(World Wide Web Consortium) Logo">
          <img src={images.w3cImg} alt="W3C(World Wide Web Consortium) Logo" />
        </figure>
        <PrintTime />
      </div>
    </div>
  );
};

export default CoverPage;
