import {
  applyMiddleware,
  combineReducers,
  compose,
  legacy_createStore,
  Reducer,
  Store,
  StoreEnhancer,
} from "redux";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";
import { PersistConfig, persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistPartial } from "redux-persist/lib/persistReducer";

import { appReducer } from "./app/app.reducer";
import { scanReducer } from "./scan/scan.reducer";
import { scanSaga } from "./scan/scan.saga";
import { ViolationsReducer } from "./violations/violations";
import { GuidedReducer } from "./guided/guided";

const rootReducer = combineReducers<ApplicationGlobalState>({
  app: appReducer,
  scan: scanReducer,
  violations: ViolationsReducer,
  guided: GuidedReducer,
});

const persistConfig: PersistConfig<ApplicationGlobalState> = {
  key: "root",
  storage,
  whitelist: ["app", "violations", "guided"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

function* rootSaga() {
  yield all([scanSaga()]);
}

const sagaMiddleware = createSagaMiddleware({});

const middlewares = [sagaMiddleware];

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      serialize: {
        // Enable serializers for "undefined", Map, Set etc.
        options: true,
      },
    })
  : compose;

const createStore = legacy_createStore as (
  reducer: Reducer<ApplicationGlobalState & PersistPartial>,
  enhancer: StoreEnhancer
) => Store;
export const reduxStore = createStore(
  persistedReducer,
  composeEnhancer(applyMiddleware(...middlewares))
);
export const persistor = persistStore(reduxStore);
sagaMiddleware.run(rootSaga);
