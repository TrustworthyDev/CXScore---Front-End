import React, { createContext } from "react";

const ViolationDetailContext = createContext<ViolationDetailContextData>({
  activeIndex: -1,
});

export default ViolationDetailContext;
