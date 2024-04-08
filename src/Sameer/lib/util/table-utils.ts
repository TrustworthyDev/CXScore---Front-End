import { getValidateUrl } from "@/utils/navigateUtils";

export const generateIssueDescription = (
  ruleDescription: string,
  explanation?: string
) => {
  return `${ruleDescription} ${
    explanation ? "\n\nExplanation: \n" + explanation : ""
  }`;
};

export const getApiViolationFields = (args: {
  dedupe?: boolean; // this is used just for calculating the Validate Link
}) => [
  { label: "Violation ID", value: "id" },
  { label: "URL", value: "url" },
  { label: "Test Status", value: "manualTestResult" },
  { label: "Success Criteria", value: "rule.detailSuccessCriteria" },
  {
    label: "Success Criteria Description",
    value: "rule.successCriteriaDescription",
    width: 120,
  },
  { label: "Disability", value: "rule.disability" },
  { label: "Principles", value: "rule.detailPrinciples" },
  { label: "WCAG", value: "rule.detailWcag2021", width: 50 },
  { label: "Conformance", value: "rule.detailLevel", width: 50 },
  { label: "Rule ID", value: "rule.name" },
  {
    label: "Issue Description",
    value: (violation: ApiViolation) =>
      generateIssueDescription(
        violation.rule?.description ?? "",
        violation.explanation
      ),
  },
  { label: "Issue Category", value: "rule.issueCategory" },
  { label: "Issue Type", value: "rule.issueClassification" },
  { label: "Issue Name", value: "rule.issueName" },
  { label: "Severity", value: "severity", width: 60 },
  { label: "Test Type", value: "rule.type" },
  { label: "Remediation Summary", value: "remediationSummary" },
  { label: "Help", value: "rule.help" },
  { label: "Help URL", value: "rule.helpUrl" },
  { label: "CSS Selector", value: "cssSelector" },
  { label: "HTML Source", value: "html" },
  { label: "Element", value: "rule.element" },
  { label: "Sec 508", value: "rule.detailSec508" },
  { label: "ACT Rule ID", value: "rule.actRuleId" },
  { label: "ACT Rule Description", value: "rule.actRuleDescription" },
  { label: "Ticket Status", value: "ticketStatus" },
  { label: "Duplicate Count", value: "dupCount" },
  { label: "Group ID", value: "groupId" },
  { label: "Event Sequence", value: "eventSequence" },
  {
    label: "Scan ID",
    value: (violation: ApiViolation) =>
      violation.scanId?.[violation.scanId.length - 1] ?? "",
  },
  {
    label: "State ID",
    value: (violation: ApiViolation) => violation.stateId ?? "",
  },
  {
    label: "Notes",
    value: "notes",
  },
  {
    label: "Validate Link",
    value: (violation: ApiViolation) =>
      `${window.location.origin}${getValidateUrl({
        appId: "",
        scanId: "",
        stateId: "",
        groupId: args.dedupe ? violation.groupId : "",
        element: "",
        url: "",
        violationId: violation.id,
        ruleId: violation.ruleId,
        isAutomated: true,
      })}`,
  },
];

export const ViolationFieldNamesForExport = [
  ...getApiViolationFields({
    dedupe: false,
  })
    .filter((field) => typeof field.value === "string")
    .map((field) => `${field.value}`),
  "scanId",
  "stateId",
];

