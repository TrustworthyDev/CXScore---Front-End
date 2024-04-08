import { createContext } from "react";

interface PerformanceContextData {
  isMobile: boolean;
  onChangeDevice: (val: boolean) => void;
}

const PerformanceContext = createContext<PerformanceContextData>({
  isMobile: true,
  onChangeDevice: () => {},
});

export default PerformanceContext;
