import clsx from "clsx";
import { Fragment } from "react";

import { ViolationType } from "@/types/enum";
import { useGuided } from "~/Sameer/lib/guided/query";

import { ViolationNoteEdit } from "./violation-note";
import { useViolations } from "../../../lib/violations/query";
import { BoxWithClipboard } from "../../atoms/box/box-with-clipboard";
import { Paper } from "../../atoms/paper";
import { DuplicateTable } from "../common/table/duplicate-table";
import { Group } from "@mantine/core";
import { DefaultFontSize } from "../common/scan-config/FontSize";
import { Zoom } from "../common/scan-config/Zoom";
import { DeviceWindowSizeOrientation } from "../common/scan-config/DeviceWindowSizeOrientation";

export const ProfileSummary = ({
  profile,
  hideDeviceIcon,
}: {
  profile: DefaultScanConfig;
  hideDeviceIcon?: boolean;
}) => {
  return (
    <Group gap="md">
      <DeviceWindowSizeOrientation
        {...profile}
        hideDeviceIcon={hideDeviceIcon}
      />
      <Zoom {...profile} />
      <DefaultFontSize {...profile} />
    </Group>
  );
};

export const ViolationDetail = ({
  violation,
  showDuplicateTable = undefined,
  showProfile = false,
  children,
  vertical = false,
}: {
  violation: ApiViolation;
  showDuplicateTable?: "violation" | "guided";
  showProfile?: boolean;
  children?: React.ReactNode;
  vertical?: boolean;
}) => {
  const issueDescription = (
    <>
      {violation.rule?.description ?? ""}

      {violation.explanation && (
        <>
          <br /> <br />
          Explanation:
          <br />
        </>
      )}
      {violation.explanation ?? ""}
    </>
  );

  return (
    <Paper className="my-2 text-left">
      <div className="space-y-4">
        <h2 className="font-display text-xl font-semibold">
          {violation?.rule?.issueName}
        </h2>
        {showProfile && violation.profile && (
          <ProfileSummary profile={violation.profile} />
        )}
        <div
          className={clsx(
            !vertical ? "grid grid-cols-3" : "flex flex-col",
            "gap-2",
          )}
        >
          <Paper className="bg-slate-100 p-0">
            <Paper className="text-md !bg-blue-400 !bg-opacity-30 py-[8px] font-display font-semibold uppercase text-blue-800">
              Issue Description
            </Paper>
            <p className="p-2">{issueDescription}</p>
          </Paper>
          <Paper className="bg-slate-100 p-0">
            <Paper className="text-md !bg-red-400 !bg-opacity-30 py-[8px] font-display font-semibold uppercase text-red-800">
              Event Sequence
            </Paper>
            <p className="p-2">
              {violation.eventSequence
                ? violation.eventSequence.join(", ")
                : "Root"}
            </p>
          </Paper>
          {violation.rule?.type !== ViolationType.manual ? (
            <Paper className="bg-slate-100 p-0">
              <Paper className="text-md !bg-green-400 !bg-opacity-30 py-[8px] font-display font-semibold uppercase text-green-800">
                Remediation Summary
              </Paper>
              <p className="p-2">
                {violation.remediationSummary?.split(":").map((txt, index) => (
                  <Fragment key={index}>
                    {txt.includes("Fix") ? txt + ":" : txt}
                    <br />
                  </Fragment>
                ))}
              </p>
            </Paper>
          ) : (
            <Paper className="bg-slate-100 p-0">
              <Paper className="text-md !bg-green-400 !bg-opacity-30 py-[8px] font-display font-semibold uppercase text-green-800">
                Test Procedure
              </Paper>
              <p className="p-2">{violation.rule?.help}</p>
            </Paper>
          )}
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
              <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                {violation.html}
              </pre>
            </code>
          </BoxWithClipboard>
          <ViolationNoteEdit violationId={violation.id} />
          {showDuplicateTable === "violation" && (
            <ViolationsDuplicateTable violation={violation} />
          )}
          {showDuplicateTable === "guided" && (
            <GuidedDuplicateTable violation={violation} />
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
      overrideFieldMatchQuery: [
        {
          field: "groupId",
          value: violation.groupId,
        },
      ],
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

const GuidedDuplicateTable = ({ violation }: { violation: ApiViolation }) => {
  const query = useGuided({
    fieldMatchQueryOpts: {
      overrideFieldMatchQuery: [
        {
          field: "groupId",
          value: violation.groupId,
        },
      ],
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

