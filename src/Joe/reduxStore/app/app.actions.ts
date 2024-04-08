import { AppInfo } from "./app.reducer";

export enum AppActionType {
  CHANGE_FILTER_SIDEBAR_OPEN = "CHANGE_FILTER_SIDEBAR_OPEN",
  CHANGE_APPLICATION = "CHANGE_APPLICATION",
  CHANGE_SELECTED_SCAN = "CHANGE_SELECTED_SCAN",
  CHANGE_SELECTED_SCHEDULER = "CHANGE_SELECTED_SCHEDULER",
  CHANGE_AUTH_TOKEN = "CHANGE_AUTH_TOKEN",
  CHANGE_A11Y_MODE = "CHANGE_A11Y_MODE",
}

export type FilterSidebarOpenPayload = {
  isOpen: boolean;
};

export type ChangeApplicationPayload = {
  appInfo: AppInfo;
};

export type ChangeSelectedScanPayload = {
  scan: ApiScan | null;
};

export type ChangeSelectedSchedulerPayload = {
  scheduler: ApiScheduler | null;
};

export type ChangeAuthTokenPayload = {
  token: string;
};

export type ChangeA11yModePayload = {
  isA11yModeEnabled: boolean;
};

export const onChangeFilterSidebarOpen = (payload: FilterSidebarOpenPayload) =>
  ({
    type: AppActionType.CHANGE_FILTER_SIDEBAR_OPEN,
    payload,
  } as const);

export const onChangeApplication = (payload: ChangeApplicationPayload) =>
  ({
    type: AppActionType.CHANGE_APPLICATION,
    payload,
  } as const);

export const onChangeSelectedScan = (payload: ChangeSelectedScanPayload) =>
  ({
    type: AppActionType.CHANGE_SELECTED_SCAN,
    payload,
  } as const);

export const onChangeSelectedScheduler = (
  payload: ChangeSelectedSchedulerPayload
) =>
  ({
    type: AppActionType.CHANGE_SELECTED_SCHEDULER,
    payload,
  } as const);

export const onChangeAuthToken = (payload: ChangeAuthTokenPayload) =>
  ({
    type: AppActionType.CHANGE_AUTH_TOKEN,
    payload,
  } as const);

export const onChangeA11yMode = (payload: ChangeA11yModePayload) =>
  ({
    type: AppActionType.CHANGE_A11Y_MODE,
    payload,
  } as const);

export type OnChangeFilterSidebarOpen = ReturnType<
  typeof onChangeFilterSidebarOpen
>;

export type OnChangeApplication = ReturnType<typeof onChangeApplication>;

export type OnChangeSelectedScan = ReturnType<typeof onChangeSelectedScan>;

export type OnChangeSelectedScheduler = ReturnType<
  typeof onChangeSelectedScheduler
>;

export type OnChangeAuthToken = ReturnType<typeof onChangeAuthToken>;

export type OnChangeA11yMode = ReturnType<typeof onChangeA11yMode>;

export type AppAction =
  | OnChangeFilterSidebarOpen
  | OnChangeApplication
  | OnChangeSelectedScan
  | OnChangeSelectedScheduler
  | OnChangeAuthToken
  | OnChangeA11yMode;
