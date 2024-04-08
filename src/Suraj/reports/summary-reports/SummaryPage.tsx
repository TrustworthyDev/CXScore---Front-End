import { DiscoveryIcon } from "@/icons/Discover";
import { HealthPlusIcon } from "@/icons/HealthPlus";
import { InfoCircleIcon } from "@/icons/InfoCircle";
import { StatsIcon } from "@/icons/Stats";
import { WarningIcon } from "@/icons/Warning";
import { selectSelectedScan } from "@/reduxStore/app/app.reducer";
import { useSelector } from "react-redux";
import images from "~/assets";
import { ExternalLink } from "../../../Sameer/components/atoms/external-link/external-link";
import { Paper } from "../../../Sameer/components/atoms/paper";
import {
  DiscoveryCard,
  DiscoveryNumberCard,
} from "../../../Sameer/components/page/common/discovery/discovery";
import { ReportCsvData } from "../../../Sameer/components/page/common/header-bar/ViewReport";
import {
  useDiscoveryByScanId,
  useHealthScoreByScanId,
} from "../../../Sameer/lib/application/use-discovery";
import { useDetailLevelResults } from "../../../Sameer/lib/home";
import { useViolations } from "../../../Sameer/lib/violations/query";
import {
  IssueCategoryViolationResultCard,
  ViolationsByPrincipalCard,
  ViolationsBySeverityCard,
} from "../../../Sameer/routes/home";
import HeadingOne from "../../component/common/headings/HeadingOne";
import HeadingThree from "../../component/common/headings/HeadingThree";
import HeadingTwo from "../../component/common/headings/HeadingTwo";
import { extractQueryParams } from "../../utils/common.utils";

const OverAllHealthDiscovery = () => {
  const selectedScanId = useSelector(selectSelectedScan)?.id ?? "";
  const healthScoreResult = useHealthScoreByScanId({
    scanId: selectedScanId,
  });

  const getHealthScore = () => {
    const queryParams = extractQueryParams(location.search);
    const parsedData: ReportCsvData | undefined = queryParams.parsedData
      ? (JSON.parse(queryParams.parsedData) as ReportCsvData)
      : undefined;
    if (parsedData?.healthPercentage) return parsedData.healthPercentage;
    else if (healthScoreResult.data?.passRate?.passRate)
      return (healthScoreResult.data?.passRate?.passRate * 100).toFixed(0);
    return 0;
  };

  return (
    <DiscoveryCard
      screenReaderLabel="Overall Health Score"
      title="Overall Health Score"
      className="print-border col-span-5"
      isLoading={healthScoreResult.isLoading}
    >
      <div className="flex h-[120px] items-center justify-evenly gap-2 px-2 py-2">
        <img
          className="h-[100px]"
          src={images.heartRateGif}
          role="presentation"
        />
        <div className="text-4xl font-semibold text-[#35ACEF]">
          {getHealthScore()}%
        </div>
      </div>
    </DiscoveryCard>
  );
};

const DetailLevelResultsCard = () => {
  const detailLevelResults = useDetailLevelResults();
  const selectedScan = useSelector(selectSelectedScan);

  return (
    <>
      <div className="col-span-4 row-span-1">
        <div className="font-md bg-[#35ACEF] text-left font-semibold text-white">
          <div className="px-4 py-1 text-center">
            Principal Category Violations
          </div>
        </div>
        <div className="grid h-[210px] grid-cols-1 gap-2 md:grid-cols-2">
          <DiscoveryNumberCard
            screenReaderLabel="Critical Violations"
            title="A"
            number={detailLevelResults.data?.A ?? 0}
            isLoading={detailLevelResults.isLoading}
          />

          <DiscoveryNumberCard
            screenReaderLabel="Serious Violations"
            title="AA"
            number={detailLevelResults.data?.AA ?? 0}
            isLoading={detailLevelResults.isLoading}
          />
        </div>
      </div>
    </>
  );
};

const StandardGuildlines = () => {
  return (
    <table className="w-full table-auto border">
      <thead className="bg-[#35ACEF]">
        <tr>
          <th className="w-3/4 px-4 py-2">
            <HeadingTwo text="Standard/Guideline" className="text-white" />
          </th>
          <th className="px-4 py-2">
            <HeadingTwo text="Included in Report" className="text-white" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border-l border-r px-4 py-2">
            <ExternalLink
              title="Web Content Accessibility Guidelines 2.0 reference link"
              aria-label="Web Content Accessibility Guidelines 2.0 reference link"
              href="https://www.w3.org/TR/2008/REC-WCAG20-20081211/"
              label="Web Content Accessibility Guidelines 2.0"
              labelMaxCharacters={4000}
              className="text-[#1174EA] underline"
            />
          </td>
          <td className="border-l border-r px-4 py-2">
            <div>Level A (Yes)</div>
            <div> Level AA (Yes) </div>
            <div>Level AAA (No)</div>
          </td>
        </tr>
        <tr>
          <td className="border-l border-r px-4 py-2">
            <ExternalLink
              title="Revised Section 508 standards published January 18, 2017
            and corrected January 22, 2018 reference link"
              aria-label="Revised Section 508 standards published January 18, 2017
            and corrected January 22, 2018 reference link"
              href="https://www.access-board.gov/ict/"
              label="Revised Section 508 standards published January 18, 2017
              and corrected January 22, 2018"
              labelMaxCharacters={4000}
              className="text-[#1174EA] underline"
            />
          </td>
          <td className="border-l border-r px-4 py-2">(Yes)</td>
        </tr>
        {/* Add more rows as needed */}
      </tbody>
    </table>
  );
};
const ViolationInsight = () => {
  return (
    <div className="col-span-12">
      <div className="flex items-center">
        <HeadingOne
          text="Violation(s) Insight"
          className="pr-4 font-bold text-[#545454]"
        />

        <StatsIcon size={18} />
      </div>
      <div className="flex items-center">
        <HeadingTwo
          text="The Violation(s) identified from the Scan are automatically classified
          under Issue Category, and Principal Category for enhanced
          prioritisation."
          className="pr-2 text-[#545454]"
        />

        {/* <ExternalLink
          href="https://www.w3.org/TR/2008/REC-WCAG20-20081211/"
          label="Learn More..."
          labelMaxCharacters={4000}
          className="text-[#1174EA]"
        /> */}
      </div>
    </div>
  );
};

const Verdict = () => {
  const queryParams = extractQueryParams(location.search);
  const parsedData: ReportCsvData | undefined = queryParams.parsedData
    ? (JSON.parse(queryParams.parsedData) as ReportCsvData)
    : undefined;

  return <div className="w-3/5 bg-[#F86F80] py-4">{parsedData?.verdict}</div>;
};

const BookADemo = () => {
  const url = "https://cxscore.ai/demo/";
  const handleClick = () => {
    window.open(url, "_blank");
  };
  return (
    <a
      className="ml-4 w-2/5 bg-[#35ACEF] py-4 text-white"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      title="Book a demo link"
      aria-label="Book a demo link"
    >
      Book A Demo Today
    </a>
  );
};

export const SummaryPage = () => {
  const selectedScanId = useSelector(selectSelectedScan)?.id ?? "";

  const { data, isLoading, isError } = useDiscoveryByScanId({
    scanId: selectedScanId,
    queryAllScans: false,
  });

  const violations = useViolations({
    outputOpts: {
      getAllViolations: true,
    },
  });
  return (
    <div>
      <div className="space-y-4 py-8">
        <div className="flex items-center">
          <HeadingOne
            text="Health Overview"
            className="pr-2 font-bold text-[#545454]"
          />
          <HealthPlusIcon size={36} />
        </div>
        <div className="grid grid-cols-12 gap-4">
          <OverAllHealthDiscovery />
          <Paper className="col-span-7 flex items-center bg-slate-50 p-4">
            <div className="w-1/6">
              <InfoCircleIcon size={60} />
            </div>
            <HeadingThree
              className="pl-4 text-justify text-[#545454]"
              text="The Health Score percentage is a directional indicator (Low %ge to High %ge) to measure and manage compliance against WCAG 2 Guidelines - Conformance Levels A (Minimum Level) and AA (Acceptable Compliance) mandated by Disability Regulations around the world. The scoring engine considers various inputs that impacts differently abled user experience."
            />
          </Paper>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <HeadingOne
              text="Discover"
              className="pr-2 font-bold text-[#545454]"
            />
            <DiscoveryIcon size={36} />
          </div>
          <div className="flex items-center">
            <WarningIcon />
            <HeadingOne
              text="Total Violations:"
              className="pr-2 text-[#545454]"
            />
            <div className="bg-[#F86F80] py-0.5 px-16">
              <HeadingOne
                text={violations.data?.totalCount}
                className="text-white"
              />
            </div>
          </div>
        </div>
        <Paper className="grid grid-cols-2 gap-4 bg-slate-50 p-4 lg:grid-cols-5">
          <>
            <DiscoveryNumberCard
              screenReaderLabel="L.O.B"
              title="L.O.B"
              number={1}
            />
            <DiscoveryNumberCard
              screenReaderLabel="Digital Assets"
              title="Digital Assets"
              number={1}
            />
            <DiscoveryNumberCard
              screenReaderLabel="Pages Scanned"
              title="Pages Scanned"
              number={data?.pageScanned ?? 0}
              isLoading={isLoading}
            />
            <DiscoveryNumberCard
              screenReaderLabel="Elements"
              title="Elements"
              number={data?.elementScanned ?? 0}
              isLoading={isLoading}
            />
            <DiscoveryNumberCard
              screenReaderLabel="Visible States"
              title="Visible States"
              number={data?.stateScanned ?? 0}
              isLoading={isLoading}
            />
          </>
        </Paper>
        <div className="grid grid-cols-12 grid-rows-1 gap-4 gap-y-8 pt-12">
          <ViolationInsight />
          <DetailLevelResultsCard />
          <IssueCategoryViolationResultCard className="col-span-12 row-span-1 md:col-span-8" />
          <ViolationsByPrincipalCard />
          <ViolationsBySeverityCard />
        </div>
        <div>
          <HeadingThree
            className="py-2 pb-2 text-[#545454]"
            text="This report covers the degree of conformance for the following accessibility standard/guidelines:"
          />
          <StandardGuildlines />
        </div>
        <div className="flex items-center">
          <span className="text-gray-700">Verdict</span>
          <hr className="m-2 flex-1 border-gray-500" />
        </div>
        <div className="flex w-full items-center justify-between text-center text-white">
          <Verdict />

          <BookADemo />
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;

