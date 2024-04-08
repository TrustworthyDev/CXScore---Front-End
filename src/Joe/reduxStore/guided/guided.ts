import { Selector } from "react-redux";
import PossibleFilters from "../../../Sameer/lookup/guided/possible-filters.json";

export enum GuidedActionType {
  SELECT_ALL_VIOLATIONS_CHECK_FILTERS = "SELECT_ALL_GUIDED_CHECK_FILTERS",
  CLEAR_ALL_VIOLATIONS_CHECK_FILTERS = "CLEAR_ALL_GUIDED_CHECK_FILTERS",
  CHANGE_VIOLATIONS_CHECK_FILTERS = "CHANGE_GUIDED_CHECK_FILTERS",
  SET_GUIDED_DO_DEDUPLICATE = "SET_GUIDED_DO_DEDUPLICATE",
  // SelectedWcagFilters
  SET_GUIDED_SELECTED_WCAG_FILTERS = "SET_GUIDED_SELECTED_WCAG_FILTERS",
}

export type GuidedState = {
  checkedFilters: typeof PossibleFilters;
  doDeDuplicate: boolean;
  selectedWcagFilters: string[];
};

export const GuidedActions = {
  [GuidedActionType.SELECT_ALL_VIOLATIONS_CHECK_FILTERS]: {
    action: () => {
      return {
        type: GuidedActionType.SELECT_ALL_VIOLATIONS_CHECK_FILTERS,
      } as const;
    },
  },
  [GuidedActionType.CLEAR_ALL_VIOLATIONS_CHECK_FILTERS]: {
    action: () => {
      return {
        type: GuidedActionType.CLEAR_ALL_VIOLATIONS_CHECK_FILTERS,
      } as const;
    },
  },
  [GuidedActionType.CHANGE_VIOLATIONS_CHECK_FILTERS]: {
    action: (payload: {
      filter: keyof typeof PossibleFilters;
      isChecked: boolean;
    }) => {
      return {
        type: GuidedActionType.CHANGE_VIOLATIONS_CHECK_FILTERS,
        payload,
      } as const;
    },
  },
  [GuidedActionType.SET_GUIDED_DO_DEDUPLICATE]: {
    action: (payload: { doDeDuplicate: boolean }) => {
      return {
        type: GuidedActionType.SET_GUIDED_DO_DEDUPLICATE,
        payload,
      } as const;
    },
  },
  [GuidedActionType.SET_GUIDED_SELECTED_WCAG_FILTERS]: {
    action: (payload: { selectedWcagFilters: string[] }) => {
      return {
        type: GuidedActionType.SET_GUIDED_SELECTED_WCAG_FILTERS,
        payload,
      } as const;
    },
  },
};

const initialFilters = Object.keys(PossibleFilters).reduce(
  (acc, filter) => ({ ...acc, [filter]: true }),
  {}
) as GuidedState["checkedFilters"];

export const getInitialGuidedState = (): GuidedState => {
  return {
    checkedFilters: initialFilters,
    doDeDuplicate: false,
    selectedWcagFilters: ["2.0", "2.1", "2.2"],
  };
};

export type GuidedActions = ReturnType<
  (typeof GuidedActions)[keyof typeof GuidedActions]["action"]
>;

export function GuidedReducer(
  state = getInitialGuidedState(),
  action: GuidedActions
): GuidedState {
  switch (action.type) {
    case GuidedActionType.SELECT_ALL_VIOLATIONS_CHECK_FILTERS: {
      return {
        ...state,
        checkedFilters: initialFilters,
      };
    }
    case GuidedActionType.CLEAR_ALL_VIOLATIONS_CHECK_FILTERS: {
      return {
        ...state,
        checkedFilters: Object.keys(PossibleFilters).reduce(
          (acc, filter) => ({ ...acc, [filter]: false }),
          {} as GuidedState["checkedFilters"]
        ),
      };
    }
    case GuidedActionType.CHANGE_VIOLATIONS_CHECK_FILTERS: {
      return {
        ...state,
        checkedFilters: {
          ...state.checkedFilters,
          [action.payload.filter]: action.payload.isChecked,
        },
      };
    }
    case GuidedActionType.SET_GUIDED_DO_DEDUPLICATE: {
      return {
        ...state,
        doDeDuplicate: action.payload.doDeDuplicate,
      };
    }
    case GuidedActionType.SET_GUIDED_SELECTED_WCAG_FILTERS: {
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
  GuidedState["checkedFilters"]
> = (state) => state.guided.checkedFilters;

const selectDoDeDuplicate: Selector<
  ApplicationGlobalState,
  GuidedState["doDeDuplicate"]
> = (state) => state.guided.doDeDuplicate;

const selectSelectedWcagFilters: Selector<
  ApplicationGlobalState,
  GuidedState["selectedWcagFilters"]
> = (state) => state.guided.selectedWcagFilters;

export const GuidedSelectors = {
  selectCheckedFilters,
  selectDoDeDuplicate,
  selectSelectedWcagFilters,
};
