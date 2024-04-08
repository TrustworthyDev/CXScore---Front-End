import { Row } from "@tanstack/react-table";
import { Fragment } from "react";
import { DuplicateTable } from "../../../Sameer/components/page/common/table/duplicate-table";
import { Paper } from "../../../Sameer/components/atoms/paper";
import { BoxWithClipboard } from "../../../Sameer/components/atoms/box/box-with-clipboard";
import { ViolationNoteEdit } from "../../../Sameer/components/page/violations/violation-note";
import { useViolations } from "../../../Sameer/lib/violations/query";

export const ValidationDetail = ({
  violation,
  showDuplicateTable = false,
  children,
}: {
  violation: ApiViolation;
  showDuplicateTable?: boolean;
  children?: React.ReactNode;
}) => {
  return (
    <Paper className="my-2">
      <div className="space-y-4">
        <h2 className="font-display text-xl font-semibold">
          {violation.rule?.issueName}
        </h2>
        <div className="flex flex-col gap-2">
          <Paper className="bg-slate-100 p-0">
            <Paper className="text-md bg-red-400 bg-opacity-30 py-[8px] font-display font-semibold uppercase text-red-800">
              Event Sequence
            </Paper>
            <p className="p-2">
              {violation.eventSequence && violation.eventSequence.length > 1
                ? violation.eventSequence.join(" ")
                : "Root"}
            </p>
          </Paper>
          <Paper className="bg-slate-100 p-0">
            <Paper className="text-md bg-blue-400 bg-opacity-30 py-[8px] font-display font-semibold uppercase text-blue-800">
              Issue Description
            </Paper>
            <p className="p-2">{violation.rule?.description}</p>
          </Paper>
          <Paper className="bg-slate-100 p-0">
            <Paper className="text-md bg-green-400 bg-opacity-30 py-[8px] font-display font-semibold uppercase text-green-800">
              Remediation Summary
            </Paper>
            <p className="p-2">
              {violation.remediationSummary?.split(":").map((txt) => (
                <Fragment>
                  {txt.includes("Fix") ? txt + ":" : txt}
                  <br />
                </Fragment>
              ))}
            </p>
          </Paper>
        </div>
        <div className="space-y-4 md:container">
          <BoxWithClipboard
            toCopy={violation.cssSelector ?? ""}
            title="CSS Selector"
          >
            <code>
              <pre style={{ whiteSpace: "pre-wrap" }}>
                {violation.cssSelector}
              </pre>
            </code>
          </BoxWithClipboard>
          <BoxWithClipboard toCopy={violation.html ?? ""} title="HTML Source">
            <code className="text-sm">
              <pre style={{ whiteSpace: "pre-wrap" }}>{violation.html}</pre>
            </code>
          </BoxWithClipboard>
          <ViolationNoteEdit violationId={violation.id} />
          {showDuplicateTable && (
            <ViolationsDuplicateTable violation={violation} />
          )}
          {children}
        </div>
      </div>
    </Paper>
  );
};

const ViolationsDuplicateTable = ({
  violation,
}: {
  violation: ApiViolation;
}) => {
  const query = useViolations({
    useHookFlags: {
      useDoDeDuplicate: false,
    },
    fieldMatchQueryOpts: {
      overrideFieldMatchQuery: [{ field: "groupId", value: violation.groupId }],
    },
    outputOpts: {
      getAllViolations: true,
    },
  });

  return (
    <DuplicateTable
      data={query.data?.result ?? []}
      isLoading={query.isLoading}
    />
  );
};
