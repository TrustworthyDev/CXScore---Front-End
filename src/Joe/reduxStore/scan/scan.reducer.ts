import { combineReducers } from "redux";
import { guidedReducer, GuidedState } from "./guided/guided.reducer";
import { ruleReducer, RuleState } from "./rule/rule.reducer";
import { ScanAction } from "./scan.actions";

export type ScanState = {
  guided: GuidedState;
  rule: RuleState;
};

const combinedReducers = combineReducers<ScanState>({
  guided: guidedReducer,
  rule: ruleReducer,
});

export function scanReducer(
  state: ScanState | undefined,
  action: ScanAction
): ScanState {
  return combinedReducers(state, action);
}
