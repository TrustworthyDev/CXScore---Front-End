import { Selector } from "react-redux";
import { GuidedAction, GuidedActionType } from "./guided.actions";

export type GuidedState = {
  statusHistory: GuidedValidationStatus[];
  currentStatus: GuidedValidationStatus;
  issueCntByCriteria: RuleIdCount[];
};

export const getInitialGuidedState = (): GuidedState => {
  return {
    statusHistory: [],
    currentStatus: {
      completed: 1,
      pending: 1,
    },
    issueCntByCriteria: [],
  };
};

export function guidedReducer(
  state = getInitialGuidedState(),
  action: GuidedAction
): GuidedState {
  switch (action.type) {
    case GuidedActionType.SETUP_GUIDED_DATA: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
}

export const selectGuidedStatusHistory: Selector<
  ApplicationGlobalState,
  GuidedValidationStatus[]
> = (state) => state.scan.guided.statusHistory;

export const selectGuidedCurrentStatus: Selector<
  ApplicationGlobalState,
  GuidedValidationStatus
> = (state) => state.scan.guided.currentStatus;

export const selectGuidedRuleByIssueCnt: Selector<
  ApplicationGlobalState,
  RuleIdCount[]
> = (state) => state.scan.guided.issueCntByCriteria;
