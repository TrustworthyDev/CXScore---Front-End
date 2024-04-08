import { all } from "redux-saga/effects";
import { guidedSaga } from "./guided/guided.saga";
import { ruleSaga } from "./rule/rule.saga";

export function* scanSaga() {
  yield all([guidedSaga(), ruleSaga()]);
}
