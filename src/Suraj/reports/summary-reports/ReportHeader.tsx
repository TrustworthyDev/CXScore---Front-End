import React from "react";
import { CXScoreLogo } from "../../../Sameer/components/atoms/logo/cxscore-logo";
import HeadingThree from "../../component/common/headings/HeadingThree";
import HeadingOne from "../../component/common/headings/HeadingOne";
import HeadingTwo from "../../component/common/headings/HeadingTwo";
import { useSelectedAppInfo } from "../../../Sameer/lib/application/use-application-data";
import { useSelector } from "react-redux";
import { selectSelectedScan } from "@/reduxStore/app/app.reducer";
import { extractDate, getTimeDifference } from "../../utils/time/time.utils";

const ReportHeader: React.FC = () => {
  const selectedApp = useSelectedAppInfo();
  const selectedScan = useSelector(selectSelectedScan);

  return (
    <header className="mb-5">
      <div className="flex items-center justify-between px-4 py-2">
        <CXScoreLogo />
        <div className="">
          <div className="flex justify-end">
            <HeadingThree
              className="pr-1 text-[#545454]"
              text="Next-gen Synthetic Tester powered by"
            />
            <HeadingThree text="GENERATIVE AI" className="font-bold" />
          </div>
          <HeadingThree
            text="This report doesn’t contain any personal or confidential information."
            className="font-bold"
          />
        </div>
      </div>
      <div className="flex items-center justify-between bg-[#35ACEF] py-2 px-4 text-white">
        <HeadingOne text={`App Name: ${selectedApp?.appName}`} />
        <div className="flex px-4 py-2">
          <HeadingTwo
            text={`Scan Run: ${extractDate(selectedScan?.timeStarted)}`}
            className="pr-4"
          />
          <HeadingTwo
            text={`Time Run: ${getTimeDifference(
              selectedScan?.timeStarted,
              selectedScan?.timeCompleted
            )}`}
          />
        </div>
      </div>
    </header>
  );
};

export default ReportHeader;
