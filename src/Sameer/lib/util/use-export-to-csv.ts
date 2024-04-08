import { useState, useCallback } from "react";
// @ts-ignore
import { Parser } from "@json2csv/plainjs";

const isSafari = () =>
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export const useExportToCSV = (args: {
  filename?: string;
  parserOpts?: unknown;
}) => {
  const { filename: overrideFilename } = args;

  const [isExporting, setExporting] = useState(false);

  const handleExportToCSV = useCallback(
    (data: Array<unknown>) => {
      setExporting(true);

      Promise.resolve(data || [])
        .then((res) => {
          const data = res;
          const parser = new Parser(args.parserOpts || {});
          const csv = parser.parse(data);
          const type = isSafari() ? "application/csv" : "text/csv";
          const blob = new Blob([csv], { type });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          const filename =
            `${overrideFilename ?? new Date().toISOString()}` + ".csv";
          link.setAttribute("href", url);
          link.setAttribute("download", filename);
          link.click();
        })
        .catch(() => {
          alert("Something went wrong while exporting to CSV");
        })
        .finally(() => {
          setExporting(false);
        });
    },
    [args.parserOpts, overrideFilename]
  );

  return {
    isExporting,
    handleExportToCSV,
  };
};
