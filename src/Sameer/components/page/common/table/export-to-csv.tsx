import { Button, Input, Modal, Stack } from "@mantine/core";

import { useCallback, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useQueryViolationArgsForGuided } from "~/Sameer/lib/guided/query";
import { ViolationFieldNamesForExport } from "~/Sameer/lib/util/table-utils";
import {
  getExportViolationFetchFn,
  useQueryViolationArgs,
} from "~/Sameer/lib/violations/query";
import { toast } from "react-toastify";
import { useSelectedAppId } from "~/Sameer/lib/application/use-application-data";
import { useExportToCSV } from "~/Sameer/lib/util/use-export-to-csv";

interface ExportToCSVFlowProps {
  type: "violation" | "guided";
}

export const ExportToCSVButtonWithData = ({
  data,
  isLoading,
  isError,
  filenamePrefix = "data",
  parserOpts = {},
}: {
  data: Array<unknown>;
  isLoading?: boolean;
  isError?: boolean;
  filenamePrefix?: string;
  parserOpts?: unknown;
}) => {
  const selectedAppId = useSelectedAppId();

  const { handleExportToCSV, isExporting } = useExportToCSV({
    filename: `${filenamePrefix}-${selectedAppId}`,
    parserOpts,
  });

  const handleExport = useCallback(() => {
    if (isLoading) {
      return;
    }

    if (isError) {
      alert("Something went wrong while exporting to CSV");
      return;
    }

    handleExportToCSV(data);
  }, [data, handleExportToCSV, isError, isLoading]);

  return (
    <Button
      disabled={isExporting || isLoading || isError}
      onClick={handleExport}
    >
      {!isLoading
        ? !isExporting
          ? "Export to CSV"
          : "Exporting..."
        : "Loading..."}
    </Button>
  );
};

export const ExportToCSVButton = ({ type }: ExportToCSVFlowProps) => {
  if (type === "violation") {
    return <StartExportToCSVViolationsButton />;
  } else {
    return <StartExportToCSVGuidedButton />;
  }
};

export const StartExportToCSVGuidedButton = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [filename, setFilename] = useState("");
  const queryViolationArgs = useQueryViolationArgsForGuided({
    useHookFlags: {
      useCheckedFilters: false,
      useDoDeDuplicate: true,
      useSelectedAppId: true,
      useSelectedScanId: true,
      useWcagFilters: true,
    },
    outputOpts: {
      fields: ViolationFieldNamesForExport,
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);

      const textCSV = await getExportViolationFetchFn(queryViolationArgs)();
      const blob = new Blob([textCSV], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      if (filename) {
        a.download = `${filename.replace(/\.csv$/i, "")}.csv`;
      } else {
        a.download = `exported-guided-${new Date().toISOString()}.csv`;
      }
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast("Download started");
    } catch {
      toast("Something went wrong while exporting to CSV");
    } finally {
      setLoading(false);
      close();
    }
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Export to CSV" centered>
        <form onSubmit={handleSubmit}>
          <Stack>
            <Input
              aria-label="Filename"
              placeholder="Filename (optional)"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
            <Button type="submit">Download</Button>
          </Stack>
        </form>
      </Modal>

      <Button
        loading={loading}
        disabled={loading}
        color="primary"
        onClick={open}
      >
        Export To CSV
      </Button>
    </>
  );
};

export const StartExportToCSVViolationsButton = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [filename, setFilename] = useState("");
  const queryViolationArgs = useQueryViolationArgs({
    useHookFlags: {
      useCheckedFilters: false,
      useDoDeDuplicate: true,
      useSelectedAppId: true,
      useSelectedScanId: true,
      useWcagFilters: true,
    },
    outputOpts: {
      fields: ViolationFieldNamesForExport,
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);

      const textCSV = await getExportViolationFetchFn(queryViolationArgs)();
      const blob = new Blob([textCSV], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      if (filename) {
        a.download = `${filename.replace(/\.csv$/i, "")}.csv`;
      } else {
        a.download = `exported-violations-${new Date().toISOString()}.csv`;
      }
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast("Download started");
    } catch {
      toast("Something went wrong while exporting to CSV");
    } finally {
      setLoading(false);
      close();
    }
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Export to CSV" centered>
        <form onSubmit={handleSubmit}>
          <Stack>
            <Input
              aria-label="Filename"
              placeholder="Filename (optional)"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
            <Button type="submit">Download</Button>
          </Stack>
        </form>
      </Modal>

      <Button
        loading={loading}
        disabled={loading}
        color="primary"
        onClick={open}
      >
        Export To CSV
      </Button>
    </>
  );
};

