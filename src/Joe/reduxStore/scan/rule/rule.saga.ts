import { getRuleData } from "@/api";
import { all, call, Effect, put, takeLatest } from "redux-saga/effects";
import { onSetupRuleData, RuleActionType } from "./rule.actions";

function* prepareRuleData() {
  const ruleMetaData: ApiRuleMeta[] = yield call(getRuleData);
  yield put(onSetupRuleData({ ruleMeta: ruleMetaData }));
}

export function* ruleSaga(): Generator<Effect> {
  yield all([takeLatest(RuleActionType.PREPARE_RULE_DATA, prepareRuleData)]);
}
