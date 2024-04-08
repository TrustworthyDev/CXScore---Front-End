export enum RuleActionType {
  SETUP_RULE_DATA = "SETUP_RULE_DATA",
  PREPARE_RULE_DATA = "PREPARE_RULE_DATA",
}

type SetupRuleDataPayload = {
  ruleMeta: ApiRuleMeta[];
};

export const onSetupRuleData = (payload: SetupRuleDataPayload) =>
  ({
    type: RuleActionType.SETUP_RULE_DATA,
    payload,
  } as const);

export const onPrepareRuleData = () =>
  ({
    type: RuleActionType.PREPARE_RULE_DATA,
  } as const);

export type OnSetupRuleData = ReturnType<typeof onSetupRuleData>;
export type OnPrepareRuleData = ReturnType<typeof onPrepareRuleData>;

export type RuleAction = OnSetupRuleData | OnPrepareRuleData;
