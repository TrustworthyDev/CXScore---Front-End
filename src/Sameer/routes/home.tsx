import { Box, Button, Group, Image, Stack, Table, Title } from "@mantine/core";
import { ResponsivePie } from "@nivo/pie";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { AudioVideoIcon } from "@/icons/AudioVideo";
import { ContrastIcon } from "@/icons/Contrast";
import { DiscoveryIcon } from "@/icons/Discover";
import { KeyboardIcon } from "@/icons/Keyboard";
import { RWDIcon } from "@/icons/RWD";
import { ScreenReaderIcon } from "@/icons/ScreenReader";
import { StructureIcon } from "@/icons/Structure";
import { UserSettingsIcon } from "@/icons/UserSettings";
import {
  selectA11yMode,
  selectSelectedScan,
} from "@/reduxStore/app/app.reducer";
import images from "~/assets";

import { formatNumber } from "../../Suraj/utils/utils";
import { PercentLineChart } from "../components/atoms/charts/single-line-chart";
import { SmallSpinner } from "../components/atoms/loading";
import { Paper } from "../components/atoms/paper";
import {
  DiscoveryCard,
  DiscoveryNumberCard,
  HealthScoreCard,
  SelectedScanDiscovery,
} from "../components/page/common/discovery/discovery";
import { HeaderBar } from "../components/page/common/header-bar";
import { SelectedScanAdvancedScanConfigSummary } from "../components/page/common/scan-config/selected-app-advanced-scan-config-summary";
import {
  useDetailLevelResults,
  useGuidedValidationTestResults,
  useIssueCategoryViolationResults,
  usePassFailResults,
  useViolationByPrincipalResults,
  useViolationBySeverityResults,
} from "../lib/home";

export const HomeRoute = () => {
  const selectedScan = useSelector(selectSelectedScan)?.id ?? null;
  return (
    <Box px="lg">
      <HeaderBar />
      {selectedScan ? (
        <div className="space-y-4 py-4 xl:container xl:mx-auto">
          <HomeDiscovery />
          <HealthOverviewHeader />
          <Paper className="grid grid-cols-12 gap-4 gap-y-8 pt-12">
            <HealthScoreCard scanId={selectedScan} className="col-span-6" />
            <DetailLevelResultsCard />
            <TestValidationCard />
            <IssueCategoryViolationResultCard />
            <ViolationsBySeverityCard />
            <ViolationsByPrincipalCard />
          </Paper>
        </div>
      ) : (
        <Paper className="m-4 space-y-4 p-8">
          <div className="text-4xl font-semibold text-gray-800">
            Your Dashboard is almost ready!
          </div>
          <div>
            No scan found for this application, run a scan to view this
            dashboard.
          </div>
          <div>
            <Link to="/scans">
              <Button
                variant="primary"
                className="!bg-[#35ACEF] text-sm md:inline-block"
              >
                Start a scan
              </Button>
            </Link>
          </div>
        </Paper>
      )}
    </Box>
  );
};

export const HomeDiscovery = () => {
  return (
    <Stack>
      <Group wrap="wrap" justify="space-between">
        <Group>
          <Title order={1}>Discovery</Title>
          <DiscoveryIcon size={36} />
        </Group>
        <SelectedScanAdvancedScanConfigSummary />
      </Group>
      <SelectedScanDiscovery
        queryAllScans={false}
        showTotalViolationsHideHealthScore
      />
    </Stack>
  );
};

const HealthOverviewHeader = () => {
  return (
    <Group wrap="wrap" className="flex-row-reverse" justify="space-between">
      <div className="flex flex-wrap items-center gap-4">
        <div className="sr-only">Quick Links:</div>
        <Link to="/scans">
          <Button
            component="div"
            variant="primary"
            color="primary"
            className="text-white"
          >
            Recent Scans
          </Button>
        </Link>
        <Link to="/violations">
          <Button
            component="div"
            variant="primary"
            color="accent"
            className="text-white"
          >
            View Violations
          </Button>
        </Link>
        <Link to="/guided-validation">
          <Button
            component="div"
            variant="primary"
            color="accentSecondary"
            className="text-white"
          >
            View Guided Validation
          </Button>
        </Link>
      </div>
      <Group>
        <Title order={2}>Health Overview</Title>
        <Image
          src={images.healthInsuranceImg}
          alt="Health Insurance"
          height={45}
          width={45}
        />
      </Group>
    </Group>
  );
};

export const PassFailResultsCard = () => {
  const passFailResults = usePassFailResults();

  return (
    <DiscoveryCard
      screenReaderLabel={`Pass/Fail Results: ${
        passFailResults.data?.passPercentage ?? 0
      }% Pass, ${passFailResults.data?.failPercentage ?? 0}% Fail, ${
        passFailResults.data?.pendingPercentage ?? 0
      }% Pending`}
      title="Pass/Fail Results"
      className="col-span-12 md:col-span-6"
    >
      <div className="flex h-full items-center justify-center">
        <div className="space-y-2 py-4">
          {passFailResults.isLoading && (
            <SmallSpinner className="!h-10 !w-10" />
          )}
          {passFailResults.isError && <div className="text-red-500">Error</div>}
          {passFailResults.data && (
            <>
              <PercentLineChart
                title="Pass"
                height={12}
                count={passFailResults.data.pass}
                percent={
                  // (healthScoreResults.data?.passRate?.passRate ?? 0) * 100
                  passFailResults.data.passPercentage
                }
              />
              <PercentLineChart
                title="Fail"
                height={12}
                fillColor="linear-gradient(135deg, #FFF6B7 0%, #F6416C 100%)"
                count={passFailResults.data.fail}
                percent={passFailResults.data.failPercentage}
              />
              <PercentLineChart
                title="Pending"
                height={12}
                fillColor="linear-gradient(135deg, #FCCF31 0%, #F55555 100%)"
                count={passFailResults.data.pending}
                percent={passFailResults.data.pendingPercentage}
              />
            </>
          )}
        </div>
      </div>
    </DiscoveryCard>
  );
};

const DetailLevelResultsCard = () => {
  const detailLevelResults = useDetailLevelResults();

  return (
    <>
      <DiscoveryNumberCard
        screenReaderLabel={`Total 'A' Violations: ${
          detailLevelResults.data?.A ?? 0
        }`}
        title="A"
        number={detailLevelResults.data?.A ?? 0}
        isLoading={detailLevelResults.isLoading}
        className="col-span-6 md:col-span-3"
      />
      <DiscoveryNumberCard
        screenReaderLabel={`Total 'AA' Violations: ${
          detailLevelResults.data?.AA ?? 0
        }`}
        title="AA"
        number={detailLevelResults.data?.AA ?? 0}
        isLoading={detailLevelResults.isLoading}
        className="col-span-6 md:col-span-3"
      />
    </>
  );
};

const TestValidationCard = () => {
  const results = useGuidedValidationTestResults();
  return (
    <DiscoveryCard
      screenReaderLabel={`Guided Validation: ${
        results.data?.testedAndConfirmedPercentage ?? 0
      }% Tested & Confirmed, ${
        results.data?.pendingPercentage ?? 0
      }% Pending in Guided Validation`}
      title="Guided Validation"
      className="col-span-12 md:col-span-5"
      isLoading={results.isLoading}
    >
      <div className="flex h-full items-center justify-center">
        <div className="space-y-2 py-4">
          <PercentLineChart
            title="Tested & Confirmed"
            percent={results.data?.testedAndConfirmedPercentage ?? 0}
            count={results.data?.testedAndConfirmed ?? 0}
          />
          <PercentLineChart
            title="Pending in Guided Validation"
            percent={results.data?.pendingPercentage ?? 0}
            count={results.data?.pending ?? 0}
            fillColor="linear-gradient(135deg, #FCCF31 0%, #F55555 100%)"
          />
        </div>
      </div>
    </DiscoveryCard>
  );
};

interface IssueCategoryViolationResultCardProps {
  className?: string;
}

const issueCategoryViolationResultIcons = {
  "Screen Reader": {
    icon: ScreenReaderIcon,
    title: "Screen Reader",
  },
  "Audio & Video": {
    icon: AudioVideoIcon,
    title: "Audio & Video",
  },
  RWD: {
    icon: RWDIcon,
    title: "RWD",
  },
  "Color Contrast": {
    icon: ContrastIcon,
    title: "Contrast",
  },
  "Structure & Layout": {
    icon: StructureIcon,
    title: "Structure & Layout",
  },
  Keyboard: {
    icon: KeyboardIcon,
    title: "Keyboard",
  },
  "User Controls": {
    icon: UserSettingsIcon,
    title: "User Controls",
  },
};

export const IssueCategoryViolationResultCard: React.FC<
  IssueCategoryViolationResultCardProps
  // eslint-disable-next-line react/prop-types
> = ({ className }) => {
  const issueCategoryViolationResult = useIssueCategoryViolationResults();

  const top5 = issueCategoryViolationResult.data
    ? Object.entries(issueCategoryViolationResult.data)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
    : [];

  return (
    <div className={clsx("col-span-12 row-span-1 md:col-span-7", className)}>
      <Box
        bg="primary"
        className="font-md w-full text-left font-semibold text-white"
      >
        <div className="px-4 py-1 text-center">
          Top 5 Issue Category Violations
        </div>
      </Box>
      <ul className="grid h-[210px] grid-cols-3 gap-2 md:grid-cols-5">
        {top5.length === 0 && (
          <li className="col-span-3 flex h-full w-full items-center justify-center bg-white md:col-span-5">
            <SmallSpinner className="!h-10 !w-10" />
          </li>
        )}
        {top5.length > 0 &&
          top5.map(([key, value]) => {
            const Icon =
              issueCategoryViolationResultIcons[
                key as keyof typeof issueCategoryViolationResultIcons
              ]?.icon;
            const title =
              issueCategoryViolationResultIcons[
                key as keyof typeof issueCategoryViolationResultIcons
              ]?.title;
            return (
              <li key={key} className="h-full">
                <DiscoveryCard
                  screenReaderLabel={`Total ${title} Violations: ${value}`}
                  title={formatNumber(value).toString()}
                  className="h-full"
                  isLoading={issueCategoryViolationResult.isLoading}
                  titleDivProps={{
                    className: "!text-2xl",
                  }}
                >
                  <div className="flex flex-col items-center justify-center gap-4 p-4">
                    <Icon className="h-[60px]" />
                    <div className="text-center uppercase">{title}</div>
                  </div>
                </DiscoveryCard>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

const generateGradients = (idPostfix: string) => {
  return [
    {
      id: "gradientBlue" + idPostfix,
      type: "linearGradient",
      colors: [
        {
          offset: 0,
          color: "#34ABEE",
        },
        {
          offset: 100,
          color: "#6DCBFF",
        },
      ],
    },
    {
      id: "gradientOrange" + idPostfix,
      type: "linearGradient",
      colors: [
        {
          offset: 0,
          color: "#FFF6B7",
        },
        {
          offset: 100,
          color: "#F6416C",
        },
      ],
    },
    {
      id: "gradientPurple" + idPostfix,
      type: "linearGradient",
      colors: [
        {
          offset: 0,
          color: "#B892F5",
        },
        {
          offset: 100,
          color: "#9F9FF7",
        },
      ],
    },
    {
      id: "gradientRed" + idPostfix,
      type: "linearGradient",
      colors: [
        {
          offset: 0,
          color: "#FFB7B7",
        },
        {
          offset: 100,
          color: "#F64182",
        },
      ],
    },
  ];
};

export const generateCommonResponsivePieProps = (postfix: string) => ({
  height: 200,
  margin: {
    top: 20,
    right: 120,
    bottom: 20,
    left: 0,
  },
  enableArcLabels: true,
  enableArcLinkLabels: false,
  arcLabelsSkipAngle: 10,
  arcLabelsTextColor: {
    from: "color",
    modifiers: [["darker", 3]],
  },
  innerRadius: 0,
  cornerRadius: 3,
  activeOuterRadiusOffset: 8,
  borderWidth: 0.5,
  borderColor: "white",
  defs: generateGradients(postfix),
});

export const commonResponsivePieLegendProps = {
  anchor: "right",
  direction: "column",
  justify: false,
  translateX: 15,
  itemsSpacing: 2,
  itemWidth: 100,
  itemHeight: 18,
  itemTextColor: "#111111",
  itemDirection: "left-to-right",
  itemOpacity: 1,
  symbolSize: 18,
  symbolShape: "circle",
};

export const ViolationsBySeverityCard = () => {
  const isA11yModeEnabled = useSelector(selectA11yMode);

  const queryResult = useViolationBySeverityResults();
  const colors = {
    Moderate: "#6DCBFF",
    Minor: "#9F9FF7",
    Critical: "#FCA997",
    Serious: "#F64182",
  };
  return (
    <DiscoveryCard
      screenReaderLabel={`Violations by Severity: ${
        queryResult.data?.Moderate ?? 0
      } Moderate, ${queryResult.data?.Minor ?? 0} Minor, ${
        queryResult.data?.Critical ?? 0
      } Critical, ${queryResult.data?.Serious ?? 0} Serious`}
      title="Violations by Severity"
      className="col-span-12 md:col-span-6"
    >
      <div className="flex h-[200px] items-center justify-center">
        {queryResult.isLoading ? (
          <SmallSpinner className="!h-10 !w-10" />
        ) : (
          <>
            {queryResult.isError && <div className="text-red-500">Error</div>}
            {queryResult.data && (
              <>
                {isA11yModeEnabled ? (
                  <div className="w-full p-2">
                    {" "}
                    <Table>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Severity</Table.Th>
                          <Table.Th>Count</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        <Table.Tr>
                          <Table.Td>Moderate</Table.Td>
                          <Table.Td>{queryResult.data?.Moderate}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                          <Table.Td>Minor</Table.Td>
                          <Table.Td>{queryResult.data?.Minor}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                          <Table.Td>Critical</Table.Td>
                          <Table.Td>{queryResult.data?.Critical}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                          <Table.Td>Serious</Table.Td>
                          <Table.Td>{queryResult.data?.Serious}</Table.Td>
                        </Table.Tr>
                      </Table.Tbody>
                    </Table>
                  </div>
                ) : (
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  <ResponsivePie
                    {...generateCommonResponsivePieProps("")}
                    data={
                      [
                        {
                          id: "Moderate",
                          value: queryResult.data?.Moderate ?? 0,
                        },
                        {
                          id: "Minor",
                          value: queryResult.data?.Minor ?? 0,
                        },
                        {
                          id: "Critical",
                          value: queryResult.data?.Critical ?? 0,
                        },
                        {
                          id: "Serious",
                          value: queryResult.data?.Serious ?? 0,
                        },
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      ] as any
                    }
                    arcLabel={(d) =>
                      `${((d.value / queryResult.data.total) * 100).toFixed(
                        0,
                      )}%`
                    }
                    colors={(data) => {
                      return colors[data.id as keyof typeof colors] ?? "black";
                    }}
                    // margin={{ right: 1 }}
                    fill={[
                      {
                        match: {
                          id: "Moderate",
                        },
                        id: "gradientBlue",
                      },
                      {
                        match: {
                          id: "Minor",
                        },
                        id: "gradientPurple",
                      },
                      {
                        match: {
                          id: "Critical",
                        },
                        id: "gradientOrange",
                      },
                      {
                        match: {
                          id: "Serious",
                        },
                        id: "gradientRed",
                      },
                    ]}
                    legends={
                      [
                        {
                          ...commonResponsivePieLegendProps,
                          data: [
                            {
                              id: "Critical",
                              label:
                                "Critical" +
                                " (" +
                                queryResult.data?.Critical +
                                ")",
                              color: colors.Critical,
                            },
                            {
                              id: "Serious",
                              label:
                                "Serious" +
                                " (" +
                                queryResult.data?.Serious +
                                ")",
                              color: colors.Serious,
                            },
                            {
                              id: "Moderate",
                              label:
                                "Moderate" +
                                " (" +
                                queryResult.data?.Moderate +
                                ")",
                              color: colors.Moderate,
                            },
                            {
                              id: "Minor",
                              label:
                                "Minor" + " (" + queryResult.data?.Minor + ")",
                              color: colors.Minor,
                            },
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          ] as any,
                        },
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      ] as any
                    }
                  />
                )}
              </>
            )}{" "}
          </>
        )}
      </div>
    </DiscoveryCard>
  );
};

export const ViolationsByPrincipalCard = () => {
  const isA11yModeEnabled = useSelector(selectA11yMode);
  const queryResult = useViolationByPrincipalResults();
  const colors = {
    Robust: "#6DCBFF",
    Understandable: "#9F9FF7",
    Operable: "#FCA997",
    Perceivable: "#F64182",
  };
  return (
    <DiscoveryCard
      screenReaderLabel={`Violations by Principles: ${
        queryResult.data?.Perceivable ?? 0
      } Perceivable, ${queryResult.data?.Operable ?? 0} Operable, ${
        queryResult.data?.Understandable ?? 0
      } Understandable, ${queryResult.data?.Robust ?? 0} Robust`}
      title="Violations by Principles"
      className="col-span-12 md:col-span-6"
    >
      <div className="relative flex h-[200px] items-center justify-center">
        <figure aria-label="W3C(World Wide Web Consortium) Logo">
          <img
            alt="W3C(World Wide Web Consortium) Logo"
            className={clsx(
              "absolute top-0 h-12 p-2",
              isA11yModeEnabled ? "right-0" : "left-0",
            )}
            src={images.w3cImg}
          />
        </figure>
        {queryResult.isLoading ? (
          <SmallSpinner className="!h-10 !w-10" />
        ) : (
          <>
            {queryResult.isError && <div className="text-red-500">Error</div>}
            {queryResult.data && (
              <>
                {isA11yModeEnabled ? (
                  <div className="w-full p-2">
                    <Table>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Principle</Table.Th>
                          <Table.Th>Count</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        <Table.Tr>
                          <Table.Td>Perceivable</Table.Td>
                          <Table.Td>{queryResult.data?.Perceivable}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                          <Table.Td>Operable</Table.Td>
                          <Table.Td>{queryResult.data?.Operable}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                          <Table.Td>Understandable</Table.Td>
                          <Table.Td>
                            {queryResult.data?.Understandable}
                          </Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                          <Table.Td>Robust</Table.Td>
                          <Table.Td>{queryResult.data?.Robust}</Table.Td>
                        </Table.Tr>
                      </Table.Tbody>
                    </Table>
                  </div>
                ) : (
                  <ResponsivePie
                    {...generateCommonResponsivePieProps("Principal")}
                    data={
                      [
                        {
                          id: "Perceivable",
                          value: queryResult.data?.Perceivable ?? 0,
                        },
                        {
                          id: "Operable",
                          value: queryResult.data?.Operable ?? 0,
                        },
                        {
                          id: "Understandable",
                          value: queryResult.data?.Understandable ?? 0,
                        },
                        {
                          id: "Robust",
                          value: queryResult.data?.Robust ?? 0,
                        },
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      ] as any
                    }
                    arcLabel={(d) =>
                      `${((d.value / queryResult.data.total) * 100).toFixed(
                        0,
                      )}%`
                    }
                    colors={(data) => {
                      return colors[data.id as keyof typeof colors] ?? "black";
                    }}
                    fill={[
                      {
                        match: {
                          id: "Robust",
                        },
                        id: "gradientBluePrincipal",
                      },
                      {
                        match: {
                          id: "Understandable",
                        },
                        id: "gradientPurplePrincipal",
                      },
                      {
                        match: {
                          id: "Operable",
                        },
                        id: "gradientOrangePrincipal",
                      },
                      {
                        match: {
                          id: "Perceivable",
                        },
                        id: "gradientRedPrincipal",
                      },
                    ]}
                    legends={[
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      {
                        ...commonResponsivePieLegendProps,
                        data: [
                          {
                            id: "Perceivable",
                            label:
                              "Perceivable" +
                              " (" +
                              queryResult.data?.Perceivable +
                              ")",
                            color: colors.Perceivable,
                          },
                          {
                            id: "Operable",
                            label:
                              "Operable" +
                              " (" +
                              queryResult.data?.Operable +
                              ")",
                            color: colors.Operable,
                          },
                          {
                            id: "Understandable",
                            label:
                              "Understandable" +
                              " (" +
                              queryResult.data?.Understandable +
                              ")",
                            color: colors.Understandable,
                          },
                          {
                            id: "Robust",
                            label:
                              "Robust" + " (" + queryResult.data?.Robust + ")",
                            color: colors.Robust,
                          },
                        ],
                      },
                    ]}
                    innerRadius={0.5}
                    alt="violation by principal categories chart"
                  />
                )}
              </>
            )}{" "}
          </>
        )}
      </div>
    </DiscoveryCard>
  );
};

