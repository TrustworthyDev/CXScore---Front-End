import { NavigateFunction } from "react-router-dom";

type ValidateNavigateProps = {
  navigate: NavigateFunction;
  appId: string;
  scanId: string;
  stateId: string;
  element: string;
  url: string;
  violationId: string;
  ruleId: string;
  groupId?: string;
  ctrlKey: boolean;
  isAutomated: boolean;
};

export const gotoValidate = ({
  navigate,
  appId,
  scanId,
  stateId,
  element,
  url,
  violationId,
  ruleId,
  ctrlKey,
  isAutomated = false,
}: ValidateNavigateProps) => {
  switch (ruleId) {
    case "CXS_Focus_Order":
    case "CXS_SR_Tab_Order":
    case "CXS_SR_Arrow_Order":

    case "CXS_Keyboard_Trap":

    case "CXS_Keyboard_Accessible":
    case "CXS_SR_Tab_Accessible":
    case "CXS_SR_Arrow_Accessible":

    case "CXS_Focus_Visible": {
      ctrlKey
        ? window.open(
            `/violations/details/${violationId}?isFromViolation=${isAutomated}`,
            "_blank"
          )
        : navigate(
            `/violations/details/${violationId}?isFromViolation=${isAutomated}`
          );
      return;
    }

    default: {
      ctrlKey
        ? window.open(
            `/guided-validation/studio?appId=${appId}&scanId=${scanId}&element=${encodeURIComponent(
              element
            )}&stateId=${stateId}&id=${violationId}&isAutomated=${isAutomated}&url=${encodeURIComponent(
              url
            )}`,
            "_blank"
          )
        : navigate(
            `/guided-validation/studio?appId=${appId}&scanId=${scanId}&element=${encodeURIComponent(
              element
            )}&stateId=${stateId}&id=${violationId}&isAutomated=${isAutomated}&url=${encodeURIComponent(
              url
            )}`
          );
    }
  }
};

export const getValidateUrl = ({
  appId,
  scanId,
  stateId,
  groupId = "",
  element,
  url,
  violationId,
  ruleId,
  isAutomated = false,
}: Omit<ValidateNavigateProps, "navigate" | "ctrlKey">) => {
  switch (ruleId) {
    case "CXS_Focus_Order":
    case "CXS_SR_Tab_Order":
    case "CXS_SR_Arrow_Order":
    case "CXS_Keyboard_Trap":
    case "CXS_Keyboard_Accessible":
    case "CXS_SR_Tab_Accessible":
    case "CXS_SR_Arrow_Accessible":
    case "CXS_Focus_Visible": {
      return `/violations/details/${violationId}?isFromViolation=${isAutomated}`;
    }
    default: {
      return `/guided-validation/studio?appId=${appId}&scanId=${scanId}&element=${encodeURIComponent(
        element
      )}&stateId=${stateId}&groupId=${groupId}&id=${violationId}&isAutomated=${isAutomated}&url=${encodeURIComponent(
        url
      )}`;
    }
  }
};
