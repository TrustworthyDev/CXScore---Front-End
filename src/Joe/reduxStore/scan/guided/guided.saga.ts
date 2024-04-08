import { GuidedActionType, onSetupGuidedData } from "./guided.actions";
import { all, call, Effect, put, select, takeLatest } from "redux-saga/effects";
import {
  Api,
  getCurrentGuidedValidationStatus,
  getGuidedValidationStatusData,
  getRuleByIssueCnt,
} from "@/api";
import { TicketStatus } from "@/types/enum";

function* startGuidedValidation() {
  const state: ApplicationGlobalState = yield select();
  const selectedAppName = state.app.appInfo?.appName;
  if (!selectedAppName) {
    return;
  }

  const [guidedData, countByStatusData, countByRuleIdData]: [
    ApiGuidedValidationData,
    [ApiCountByTicketStatusData],
    [ApiCountByRuleId]
  ] = yield all([
    getGuidedValidationStatusData(),
    getCurrentGuidedValidationStatus(selectedAppName),
    getRuleByIssueCnt(selectedAppName),
  ]);
  const { statusHistory } = guidedData;
  const { values: countByStatus } = countByStatusData[0];
  const { values: countByRuleId } = countByRuleIdData[0];

  const currentStatus = {
    completed: countByStatus.reduce(
      (cnt, item) =>
        item.value === TicketStatus.done ? cnt + item.count : cnt,
      0
    ),
    pending: countByStatus.reduce(
      (cnt, item) =>
        item.value !== TicketStatus.done ? cnt + item.count : cnt,
      0
    ),
  };

  yield put(
    onSetupGuidedData({
      statusHistory,
      currentStatus,
      issueCntByCriteria: countByRuleId.sort((a, b) => b.count - a.count),
    })
  );
}

export function* guidedSaga(): Generator<Effect> {
  yield all([
    takeLatest(GuidedActionType.START_GUIDED_VALIDATION, startGuidedValidation),
  ]);
}
