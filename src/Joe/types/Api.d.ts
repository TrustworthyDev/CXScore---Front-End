interface GuidedValidationStatus {
  completed: number;
  pending: number;
}

interface StatusTicketCount {
  value: import("./enum").TicketStatus;
  count: number;
}

interface RuleIdCount {
  value: string;
  count: number;
}

type ApiCountData = StatusTicketCount | RuleIdCount;

interface ApiCountByTicketStatusData {
  field: "ticketStatus";
  values: StatusTicketCount[];
}

interface ApiCountByRuleId {
  field: "ruleId";
  values: RuleIdCount[];
}

interface ApiGuidedValidationData {
  statusHistory: GuidedValidationStatus[];
}

interface ApiRuleMeta {
  id: string;
  name: string;
  type?: import("./enum").ViolationType;
  tags: string[];
  description: string;
  help: string;
  helpUrl: string;
  detailPrinciples?: string;
  detailSuccessCriteria?: string;
  successCriteriaDescription?: string;
  disability?: string;
  detailLevel?: string;
  detailWcag2021?: string;
  detailSec508?: string;
  element?: string;
  issueCategory?: string;
  issueClassification?: string;
  issueName?: string;
  impact?: string;
  remediationSummary?: string;
  actRuleId?: string;
  actRuleDescription?: string;
  status: import("./enum").RuleStatus;
  scanTime: import("./enum").RuleScanTime;
}

interface ApplicationRuleMeta extends ApiRuleMeta {
  ruleStatus: boolean;
  jiraStatus: boolean;
}

interface ApiApplicationChange {
  enableAllRules?: boolean;
  enabledRules?: string[];
  createJiraForAllRules?: boolean;
  createJiraForRules?: string[];
}

interface blockConfig {
  selectors?: string[];
}

interface DefaultScanConfig {
  blockConfig?: blockConfig;
  orientation?: "landscape" | "portrait";
  emulateGeoLocation?: {
    latitude: number;
    longitude: number;
  };
  windowSize?: string; // format “x,y”, for example “1920,1080”
  deviceScaleFactor?: number; // a float number of scale, 1 is the normal size
  darkMode?: boolean; // emulate dark mode
  defaultFontSize?: number;
  browserType?: "chrome" | "firefox" | "edge" | "safari";
  device?: string;
  location?: string;
  network?: string;
}

interface ApiApplicationInfo {
  id: string;
  name: string;
  lastScan: string; // Date
  organization?: string;
  subOrg?: string;
  project?: string;
  importance?: string; //should be enum
  location?: string;
  enableAllRules?: boolean;
  enabledRules?: string[];
  createJiraForAllRules?: boolean;
  createJiraForRules?: string[];
  defaultScanConfig?: DefaultScanConfig;
  apcaOptions?: {
    lenience?: 1 | 2 | 3;
  };
  focusVisibleConfig?: {
    lenience?: 1 | 2 | 3;
  };
}

interface ApiScanInfo {
  id: string;
  urlVisited: string[];
  timeStarted2: string; // Date
  timeCompleted: string; // Date
  resultId: string[];
  status: string; // should be enum
  timeInitialized: string; // Date
  appName: string;
  applicationId: string;
  currentStep: number;
  maxSteps: number;
  stage: string;
  timeStarted: string; // Date
}

interface ElementDetail {
  path: string;
  rectangle: Rectangle;
}

interface IndexedElementDetail {
  index: number;
  path_rectangle: ElementDetail;
}

interface ApiViolation {
  id: string;
  type: string;
  applicationId: string;
  appName: string;
  stateId: string;
  url: string;
  cssSelector?: string;
  ruleId: string;
  scanId: string[];
  details:
    | string
    | ElementDetail
    | ElementDetail[]
    | CXSFocusOrderDetail
    | CXSKeyboardTrapDetail;
  explanation?: string;
  ticketId?: string;
  ticketStatus: import("./enum").TicketStatus;
  manualTestResult?: import("./enum").ManualTestResult;
  eventSequence: string[];
  snapshotUrl: string;
  remediationSummary: string;
  html?: string;
  scan?: ApiScanInfo[];
  application?: ApiApplicationInfo;
  rule?: ApiRuleMeta;
  bounds?: Rectangle;
  severity?: string;
  dupCount?: string | number;
  elementType?: string;
  groupId?: string;
  issueCategory?: string;
  successCriteriaDescription?: string;
  notes?: string;
  profile?: DefaultScanConfig;
}

interface ApiGuidedValidationByRule {
  ruleId: string;
  rule?: ApiRuleMeta;
  validations: ApiViolation[];
}

type ScanConfig = {
  clickMouseDelayMs?: number;
  navigatePageDelayMs?: number;
  confirmStateIterations?: number;
  autoConfigStateCompareExclusion?: boolean;
  stateComparator?: string;
  maxJiraTickets?: number;
  maxDepth?: number;
  debugCrawl?: boolean;
  doFocusComponentTest?: boolean;
  maxClickableSize?: number;
  appId?: {
    name?: string;
    id?: string;
  };
  url?: string;
  scanType?: import("./enum").ScanType;
  scanSubType?: import("./enum").ScanSubType;
  scanUrlList?: string[];
  parentScanId?: string;
  disableAxeScan?: boolean;
  maxSteps?: number;
  axeScanOnly?: boolean;
  sourceGraphId?: string;
  runOnlyAxeRules?: string[];
  axeSelector?: string;
  rescanViolationId?: string[];
  scanOnlyStateId?: string;
  browserWindow?: boolean;
  scanName?: string;
  scanWithEvents?: string;
  scanWithEventsBuildOnly?: boolean;
  scanners?: string[];
  useDefaultProfilesByScanType?: boolean;
  profiles?: DefaultScanConfig[];
} & DefaultScanConfig;

type StateError = {
  stateId: string;
  url: string;
  errors: string[];
};

type UrlError = {
  url: string;
  statusCode: number;
  error: string;
};

interface ApiScan {
  id: string;
  status: import("./enum").ScanStatus; //enum
  applicationId: string;
  appName: string;
  timeCompleted: Date;
  timeCompleted2: Date;
  timeStarted: Date;
  stage: string; //Might be enum
  config: ScanConfig;
  maxSteps: number;
  currentStep: number;
  parentScanId: string;
  violationCount: number;
  scanType: import("./enum").ScanType;
  errors: string[];
  stateErrors?: StateError[];
  urlErrors?: UrlError[];
}

interface ApiScheduler {
  id: string;
  applicationId: string;
  scanName: string;
  scanType: import("./enum").ScanSubType;
  urlList: string[];
  frequency: import("./enum").SchedulerFrequency;
  timeOfDayInSeconds: number;
  startDate: Date;
  endDate: "never" | Date;
  scanIdList: string[];
  creationTime: Date;
  scan?: ApiScan[];
  active?: boolean;
}

interface ScheduleConfig {
  applicationId: string;
  scanName: string;
  scanType: import("./enum").ScanSubType;
  urlList: string[];
  frequency: import("./enum").SchedulerFrequency;
  timeOfDayInSeconds: number;
  startDate: string;
  endDate: "never" | string;
}

type ApiAppSummary = {
  scanId: string;
  pageScanned: number;
  stateScanned: number;
  elementScanned: number;
  scansRun: number;
};

type ApiCurrentUser = {
  name: string;
  brandType: import("./enum").BrandType;
  role: import("../../Suraj/pages/settings/settings-api.d").RoleType;
  orgId: string;
  userName: string;
  _id: string;
};

type ApiReportPermission = {
  status: string;
  allowed: boolean;
};

type ApiScanResultStatus = {
  passRate: {
    passRate: number;
  };
};

interface ApiCreateTicketResultItem {
  violationId: string;
  ticketId: string;
  status: TicketStatus;
  error: string;
}

type ApiTicketLinkResult = {
  status: string;
  link: string;
};
interface ApiStateSummary {
  // url
  [string]: {
    // state
    [string]: {
      eventSequence: string[];
      violationCount: number;
    };
  };
}

interface ApiTunnel {
  id: string;
  name: string;
  target: string;
}

interface ApiSequenceDetail {
  id: string;
  name: string;
  eventSequence: BrowserEvent[];
}

interface PerfMetric {
  metricType: import("./enum").PerfMetricType;
  metricDescription: string;
  metricUnit: string;
  value: number[];
  limitProp: Record<import("./enum").PerfLimitType, number>;
}

interface ApiPerfScanInfo {
  scanId: string;
  scanType: unknown;
  timeStarted: string;
  timeCompleted: string;
  scanStatus: unknown;
  config: PerfScanConfig;
}

interface ApiAppPerfOverview {
  appId: string;
  deviceConfig: unknown;
  urlList: ApiUrlPerfDetail[];
  aggregateMetrics: Record<
    import("./enum").DeviceType,
    {
      [key in PerfMetricType]: PerfMetric;
    }
  >;
}

interface PerfScanDetail {
  id: string;
  perfScanMetrics: Record<import("./enum").DeviceType, PerfMetric[]>;
  scanConfig: ScanConfig;
}

interface ApiUrlPerfDetail {
  appId: string;
  url: string;
  perfScanDetail: PerfScanDetail;
  scanId: string;
}

interface ApiPerfUrlScanList {
  appId: string;
  url: string;
  scanList: ApiPerfScanInfo[];
}

interface ApiPerfScan {
  perfScanMetrics: Record<import("./enum").DeviceType, PerfDeviceMetrics[]>;
  scanConfig: ScanConfig;
}

interface PerfDeviceConfig {
  device: import("./enum").PerfDeviceType;
  network: import("./enum").PerfNetworkType;
  location: import("./enum").PerfLocationType;
}

interface PerfDeviceMetrics {
  deviceConfig: PerfDeviceConfig;
  perfScanMetrics: { [key in import("./enum").PerfMetricType]: PerfMetric }[];
}

type PerfViolationPhaseLimit =
  | {
      phase: "TTFB" | "Load Delay" | "Load Time" | "Render Delay";
      value: [number, number];
    }
  | {
      phase: "Input Delay" | "Processing Time" | "Presentation Delay";
      value: [number, number];
    };

interface ApiPerfViolation {
  id: string;
  manualTestResult: import("./enum").ManualTestResult;
  needFix: string;
  applicationId: string;
  appName: string;
  stateId: string;
  url: string;
  actualStateId: string;
  ruleId: import("./enum").PerfRuleType;
  scanId: string[];
  details: import("lighthouse/types/lhr/audit-result").Result[][];
  ticketStatus: import("./enum").TicketStatus;
  eventSequence: string[];
  snapshotUrl: string;
  remediationSummary: string;
  successCriteriaDescription: string;
  issueCategory: string;
  bestPracticeOnly: boolean;
  severity: string;
  actionType: string;
  appVersion: string[];
  ruleIdForIndex: string;
  urlForIndex: string;
  groupId: string;
  cpu: string;
  network: string;
  distance: string;
  breakdownThresholds?: PerfViolationPhaseLimit[];
}

