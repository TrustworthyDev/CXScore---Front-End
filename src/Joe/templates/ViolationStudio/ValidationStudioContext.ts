import { ManualTestResult } from "@/types/enum";
import React, { createContext } from "react";

const ValidationStudioContext = createContext<ValidationStudioContextData>({
  activeItem: {
    activeRule: "",
    activeValidation: "",
  },
});

export default ValidationStudioContext;
