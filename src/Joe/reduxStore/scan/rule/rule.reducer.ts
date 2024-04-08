import { Selector } from "react-redux";
import { RuleAction, RuleActionType } from "./rule.actions";

export type RuleState = {
  ruleMeta: ApiRuleMeta[];
};

export const getInitialGuidedState = (): RuleState => {
  return {
    ruleMeta: [],
  };
};

export function ruleReducer(
  state = getInitialGuidedState(),
  action: RuleAction
): RuleState {
  switch (action.type) {
    case RuleActionType.SETUP_RULE_DATA: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
}

export const selectRuleMetaData: Selector<
  ApplicationGlobalState,
  ApiRuleMeta[]
> = (state) => state.scan.rule.ruleMeta;
