import { Row } from "@tanstack/react-table";
import { createContext } from "react";

interface PerViolationsTableContextData {
  handleOpenSnapshot: (row: Row<ApiPerfViolation>) => void;
}

const PerViolationsTableContext = createContext<PerViolationsTableContextData>({
  handleOpenSnapshot: () => {},
});

export default PerViolationsTableContext;
