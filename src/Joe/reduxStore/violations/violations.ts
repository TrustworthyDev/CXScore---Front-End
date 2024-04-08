import { Selector } from "react-redux";
import PossibleFilters from "../../../Sameer/lookup/violations/possible-filters.json";

export enum ViolationsActionType {
  SELECT_ALL_VIOLATIONS_CHECK_FILTERS = "SELECT_ALL_VIOLATIONS_CHECK_FILTERS",
  CLEAR_ALL_VIOLATIONS_CHECK_FILTERS = "CLEAR_ALL_VIOLATIONS_CHECK_FILTERS",
  CHANGE_VIOLATIONS_CHECK_FILTERS = "CHANGE_VIOLATIONS_CHECK_FILTERS",
  SET_VIOLATIONS_DO_DEDUPLICATE = "SET_VIOLATIONS_DO_DEDUPLICATE",
  // State ID related actions
  SET_VIOLATION_STATE_IDS = "SET_VIOLATION_STATE_IDS",
  CLEAR_VIOLATION_STATE_IDS = "CLEAR_VIOLATION_STATE_IDS",
  // SelectedWcagFilters
  SET_VIOLATION_SELECTED_WCAG_FILTERS = "SET_VIOLATION_SELECTED_WCAG_FILTERS",
}

export type ViolationsState = {
  checkedFilters: typeof PossibleFilters;
  doDeDuplicate: boolean;
  selectedStateIds: string[];
  selectedWcagFilters: string[];
};

export const ViolationsActions = {
  [ViolationsActionType.SELECT_ALL_VIOLATIONS_CHECK_FILTERS]: {
    action: () => {
      return {
        type: ViolationsActionType.SELECT_ALL_VIOLATIONS_CHECK_FILTERS,
      } as const;
    },
  },
  [ViolationsActionType.CLEAR_ALL_VIOLATIONS_CHECK_FILTERS]: {
    action: () => {
      return {
        type: ViolationsActionType.CLEAR_ALL_VIOLATIONS_CHECK_FILTERS,
      } as const;
    },
  },
  [ViolationsActionType.CHANGE_VIOLATIONS_CHECK_FILTERS]: {
    action: (payload: {
      filter: keyof typeof PossibleFilters;
      isChecked: boolean;
    }) => {
      return {
        type: ViolationsActionType.CHANGE_VIOLATIONS_CHECK_FILTERS,
        payload,
      } as const;
    },
  },
  [ViolationsActionType.SET_VIOLATIONS_DO_DEDUPLICATE]: {
    action: (payload: { doDeDuplicate: boolean }) => {
      return {
        type: ViolationsActionType.SET_VIOLATIONS_DO_DEDUPLICATE,
        payload,
      } as const;
    },
  },
  [ViolationsActionType.SET_VIOLATION_STATE_IDS]: {
    action: (payload: { selectedStateIds: string[] }) => {
      return {
        type: ViolationsActionType.SET_VIOLATION_STATE_IDS,
        payload,
      } as const;
    },
  },
  [ViolationsActionType.CLEAR_VIOLATION_STATE_IDS]: {
    action: () => {
      return {
        type: ViolationsActionType.CLEAR_VIOLATION_STATE_IDS,
      } as const;
    },
  },
  [ViolationsActionType.SET_VIOLATION_SELECTED_WCAG_FILTERS]: {
    action: (payload: { selectedWcagFilters: string[] }) => {
      return {
        type: ViolationsActionType.SET_VIOLATION_SELECTED_WCAG_FILTERS,
        payload,
      } as const;
    },
  },
};

const initialFilters = Object.keys(PossibleFilters).reduce(
  (acc, filter) => ({ ...acc, [filter]: true }),
  {}
) as ViolationsState["checkedFilters"];

export const getInitialViolationsState = (): ViolationsState => {
  return {
    checkedFilters: initialFilters,
    doDeDuplicate: false,
    selectedStateIds: [],
    selectedWcagFilters: ["2.0", "2.1", "2.2"],
  };
};

export type ViolationsActions = ReturnType<
  (typeof ViolationsActions)[keyof typeof ViolationsActions]["action"]
>;

export function ViolationsReducer(
  state = getInitialViolationsState(),
  action: ViolationsActions
): ViolationsState {
  switch (action.type) {
    case ViolationsActionType.SELECT_ALL_VIOLATIONS_CHECK_FILTERS: {
      return {
        ...state,
        checkedFilters: initialFilters,
      };
    }
    case ViolationsActionType.CLEAR_ALL_VIOLATIONS_CHECK_FILTERS: {
      return {
        ...state,
        checkedFilters: Object.keys(PossibleFilters).reduce(
          (acc, filter) => ({ ...acc, [filter]: false }),
          {} as ViolationsState["checkedFilters"]
        ),
      };
    }
    case ViolationsActionType.CHANGE_VIOLATIONS_CHECK_FILTERS: {
      return {
        ...state,
        checkedFilters: {
          ...state.checkedFilters,
          [action.payload.filter]: action.payload.isChecked,
        },
      };
    }
    case ViolationsActionType.SET_VIOLATIONS_DO_DEDUPLICATE: {
      return {
        ...state,
        doDeDuplicate: action.payload.doDeDuplicate,
      };
    }
    case ViolationsActionType.SET_VIOLATION_STATE_IDS: {
      return {
        ...state,
        selectedStateIds: action.payload.selectedStateIds,
      };
    }
    case ViolationsActionType.CLEAR_VIOLATION_STATE_IDS: {
      return {
        ...state,
        selectedStateIds: [],
      };
    }
    case ViolationsActionType.SET_VIOLATION_SELECTED_WCAG_FILTERS: {
      return {
        ...state,
        selectedWcagFilters: action.payload.selectedWcagFilters,
      };
    }
    default:
      return state;
  }
}

const selectCheckedFilters: Selector<
  ApplicationGlobalState,
  ViolationsState["checkedFilters"]
> = (state) => state.violations.checkedFilters;

const selectDoDeDuplicate: Selector<
  ApplicationGlobalState,
  ViolationsState["doDeDuplicate"]
> = (state) => state.violations.doDeDuplicate;

const selectSelectedStateIds: Selector<
  ApplicationGlobalState,
  ViolationsState["selectedStateIds"]
> = (state) => state.violations.selectedStateIds;

const selectSelectedWcagFilters: Selector<
  ApplicationGlobalState,
  ViolationsState["selectedWcagFilters"]
> = (state) => state.violations.selectedWcagFilters;

export const ViolationsSelectors = {
  selectCheckedFilters,
  selectDoDeDuplicate,
  selectSelectedStateIds,
  selectSelectedWcagFilters,
};
