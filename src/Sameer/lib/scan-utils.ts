import { ScanStatus } from "@/types/enum";

export const isScanComplete = (scan: ApiScan) =>
  scan.status === ScanStatus.Done || scan.status === ScanStatus.Failed;
