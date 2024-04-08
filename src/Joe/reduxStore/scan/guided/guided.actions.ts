export enum GuidedActionType {
  START_GUIDED_VALIDATION = "START_GUIDED_VALIDATION",
  SETUP_GUIDED_DATA = "SETUP_GUIDED_DATA",
  SET_GUIDED_STATUS = "SET_GUIDED_STATUS",
}

export type GuidedDataPayload = {
  statusHistory: GuidedValidationStatus[];
  currentStatus: GuidedValidationStatus;
  issueCntByCriteria: RuleIdCount[];
};

export const onStartGuidedValidation = () =>
  ({
    type: GuidedActionType.START_GUIDED_VALIDATION,
  } as const);

export const onSetupGuidedData = (payload: GuidedDataPayload) =>
  ({
    type: GuidedActionType.SETUP_GUIDED_DATA,
    payload,
  } as const);

export type OnStartGuidedValidation = ReturnType<
  typeof onStartGuidedValidation
>;

export type OnSetupGuidedData = ReturnType<typeof onSetupGuidedData>;

export type GuidedAction = OnStartGuidedValidation | OnSetupGuidedData;
