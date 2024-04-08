export enum TicketStatus {
  pending = "Pending",
  unassigned = "Unassigned",
  in_progress = "In Progress",
  done = "Done",
}

export enum ManualTestResult {
  pass = "pass",
  fail = "failed",
  pending = "pending",
}

export enum ObjectType {
  Image = "Image",
  BoundRect = "BoundRect",
}

export enum ViolationType {
  automated = "Automated",
  manual = "Manual",
}

export enum CanvasObjectType {
  BoundRect = "boundRect",
}

export enum ScanType {
  SinglePageScan = "SinglePageScan",
  MultiPageScan = "MultiPageScan",
  ViolationReScan = "ViolationReScan",
  FullPageScan = "FullPageScan",
}

export enum ScanSubType {
  RapidScan = "RapidScan",
  DeepScan = "DeepScan",
  PriorityScan = "PriorityScan",
  FullScan = "FullScan",
}

export enum ScheduleEndType {
  Never = "Never",
  Date = "Date",
}

export enum ScanStatus {
  Done = "done",
  Queued = "queued",
  Running = "running",
  Failed = "failed",
}

export enum CXSFocusOrderType {
  TYPE0 = 0,
  TYPE1 = 1,
  TYPE2 = 2,
  TYPEM1 = -1,
}

export enum SchedulerFrequency {
  Daily = "daily",
  Weekly = "weekly",
  Monthly = "monthly",
  Quarterly = "quarterly",
}

export enum BrandType {
  accessbot = "accessbot",
  cxscore = "cxscore",
}

export enum RuleStatus {
  live = "Live",
  beta = "beta",
}

export enum RuleScanTime {
  rapid = "Rapid",
  moderate = "Moderate",
  high = "High",
}

export enum PerfLimitType {
  low = "low",
  medium = "medium",
  high = "high",
}

export enum PerfMetricType {
  CLS = "CLS",
  FCP = "FCP",
  INP = "INP",
  LCP = "LCP",
  SI = "SI",
  TBT = "TBT",
  TTFB = "TTFB",
  PS = "PS",
}

export enum PerfRuleType {
  CLS = "CXS_Performance_CLS",
  FCP = "CXS_Performance_FCP",
  INP = "CXS_Performance_INP",
  LCP = "CXS_Performance_LCP",
  SI = "CXS_Performance_SI",
  TBT = "CXS_Performance_TBT",
  TTFB = "CXS_Performance_TTFB",
  PS = "CXS_Performance_PS",
}

export enum DeviceType {
  DESKTOP = "desktop",
  MOBILE = "mobile",
}

export enum PerfDeviceType {
  LOW_END = "Low-End",
  MID_TIER = "Mid-Tier",
  HIGH_END = "High-End",
}

export enum PerfNetworkType {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
}
export enum PerfLocationType {
  CLOSE = "Close",
  MEDIUM = "Medium",
  FAR = "Far",
}
