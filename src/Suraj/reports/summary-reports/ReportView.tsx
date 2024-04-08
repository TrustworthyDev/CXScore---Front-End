import React from "react";
import AboutUs from "./AboutUs";
import CoverPage from "./CoverPage";
import ReportHeader from "./ReportHeader";
import SampleViolationsTablesPages from "./SampleViolationsTablesPages";
import SummaryPage from "./SummaryPage";
import ViolationStudioList from "./ViolationStudioList";

const ReportView = () => {
  return (
    <div>
      <div className="px-16 py-4 pt-10">
        <CoverPage />

        <div className="horizontal-line my-10"></div>
        <div className="page-break-before">
          <ReportHeader />
        </div>

        <div className="px-10">
          <SummaryPage />
        </div>
        <div className="horizontal-line my-10"></div>
        <div className="hidden-in-app show-in-print page-break-before">
          <ReportHeader />
        </div>
        <div className="px-10">
          <SampleViolationsTablesPages />
        </div>
        <div className="horizontal-line my-10"></div>
        <div className="hidden-in-app show-in-print page-break-before">
          <ReportHeader />
        </div>
        <div className="px-10">
          <ViolationStudioList />
        </div>
        <div className="horizontal-line my-10"></div>
      </div>
      <AboutUs />
    </div>
  );
};

export default ReportView;
