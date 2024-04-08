import React, { createContext } from "react";

const SchedulerPageContext = createContext<SchedulerPageContextData>({
  curActiveStatus: {},
});

export default SchedulerPageContext;
