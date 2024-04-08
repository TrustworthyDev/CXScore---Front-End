type ApplicationGlobalState = {
  // auth:
  app: import("@/reduxStore/app/app.reducer").AppState;
  scan: import("@/reduxStore/scan/scan.reducer").ScanState;
  violations: import("../reduxStore/violations/violations").ViolationsState;
  guided: import("../reduxStore/guided/guided").GuidedState;
};

