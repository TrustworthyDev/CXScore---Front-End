type ActiveItem = {
  activeRule?: string;
  activeValidation?: string;
};

type ListRowElementProps<T> = {
  row: T;
};

type IndexedValidation = {
  index: number;
  validation: ApiViolation;
};

type ValidationByRule = {
  ruleId: string;
  rule?: ApiRuleMeta;
  validations: IndexedValidation[];
};

type ValidationStudioContextData = {
  activeItem: ActiveItem;
  setActiveItem?: (item: ActiveItem) => void;
  currentTestResult?: ManualTestResult;
  setCurrentTestResult?: (result: ManualTestResult) => void;
  isFromViolations?: boolean;
};

type ValidationState = {
  violationType?: ViolationType;
};
