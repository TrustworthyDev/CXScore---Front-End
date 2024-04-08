import { createContext } from "react";

type PerfScansPageContextData = {
  refetchScans?: () => void;
  setIsConfirmOpen?: (val: boolean) => void;
  setConfirmModalProps?: (modalProps: {
    content: string;
    onClickButton: (id: string) => void;
  }) => void;
};

const PerfScansPageContext = createContext<PerfScansPageContextData>({});

export default PerfScansPageContext;
