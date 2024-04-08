import { Selector } from "react-redux";
import { AppAction, AppActionType } from "./app.actions";

export type AppInfo = {
  appId: string;
  appName: string;
};

export type AppState = {
  appInfo: AppInfo | null;
  selectedScan: ApiScan | null;
  selectedScheduler: ApiScheduler | null;
  isFilterSidebarOpen: boolean;
  authToken: string;
  isA11yModeEnabled?: boolean;
};

export const getInitialAppState = (): AppState => {
  return {
    appInfo: null,
    selectedScan: null,
    selectedScheduler: null,
    isFilterSidebarOpen: false,
    // Storing this here may not be appropriate
    // Maybe we can fix this after we implement refresh token(cookie?) and
    // store this token in memory
    authToken: "",
    isA11yModeEnabled: false,
  };
};

export function appReducer(
  state = getInitialAppState(),
  action: AppAction
): AppState {
  switch (action.type) {
    case AppActionType.CHANGE_FILTER_SIDEBAR_OPEN: {
      return {
        ...state,
        isFilterSidebarOpen: action.payload.isOpen,
      };
    }
    case AppActionType.CHANGE_APPLICATION: {
      return {
        ...state,
        appInfo: action.payload.appInfo,
      };
    }
    case AppActionType.CHANGE_SELECTED_SCAN: {
      return {
        ...state,
        selectedScan: action.payload.scan,
      };
    }
    case AppActionType.CHANGE_SELECTED_SCHEDULER: {
      return {
        ...state,
        selectedScheduler: action.payload.scheduler,
      };
    }
    case AppActionType.CHANGE_AUTH_TOKEN: {
      return {
        ...state,
        authToken: action.payload.token,
      };
    }
    case AppActionType.CHANGE_A11Y_MODE: {
      return {
        ...state,
        isA11yModeEnabled: action.payload.isA11yModeEnabled,
      };
    }
    default:
      return state;
  }
}

export const selectFilterSidebarOpen: Selector<
  ApplicationGlobalState,
  boolean
> = (state) => state.app.isFilterSidebarOpen;

export const selectApplicationInfo: Selector<
  ApplicationGlobalState,
  AppState["appInfo"]
> = (state) => state.app.appInfo;

export const selectSelectedScan: Selector<
  ApplicationGlobalState,
  AppState["selectedScan"]
> = (state) => state.app.selectedScan;

export const selectSelectedScheduler: Selector<
  ApplicationGlobalState,
  AppState["selectedScheduler"]
> = (state) => state.app.selectedScheduler;

export const selectAuthToken: Selector<
  ApplicationGlobalState,
  AppState["authToken"]
> = (state) => state.app.authToken;

export const selectA11yMode: Selector<
  ApplicationGlobalState,
  AppState["isA11yModeEnabled"]
> = (state) => state.app.isA11yModeEnabled;
