import { Button, Group, Switch } from "@mantine/core";
import { ColumnDef, Row } from "@tanstack/react-table";
import React, { useCallback, useContext, useMemo, useState } from "react";

import { Box } from "@/atoms/Box";
import {
  Table,
  TableActionProps,
  TableFooterProps,
} from "@/atoms/Table/MantineTable";
import { ViolationType } from "@/types/enum";
import { ExportToCSVButtonWithData } from "~/Sameer/components/page/common/table/export-to-csv";

import RulesPageContext from "./RulesPageContext";
import {
  TableSelectionCell,
  TableSelectionHeader,
} from "../../../Sameer/components/page/common/table/selection";

export type RulesTableProps = {
  rulesData: ApplicationRuleMeta[];
};

const RuleOrJiraStatusCell = ({
  row,
  checked,
  isRuleStatus = true,
}: {
  row: Row<ApplicationRuleMeta>;
  checked: boolean;
  isRuleStatus?: boolean;
}) => {
  const { onUpdateRuleOrJiraStatus } = useContext(RulesPageContext);

  const handleChange = () => {
    onUpdateRuleOrJiraStatus &&
      onUpdateRuleOrJiraStatus([row.original.id], isRuleStatus);
  };
  return <Switch checked={checked} onChange={handleChange} />;
};

const columns: ColumnDef<ApplicationRuleMeta>[] = [
  {
    id: "select",
    footer: "Select",
    header: ({ table }) => <TableSelectionHeader table={table} />,
    cell: ({ row }) => <TableSelectionCell row={row} />,
  },
  {
    id: "id*",
    footer: "Rule ID(Short Name)",
    accessorFn: (row) => row.id,
    header: "Rule ID(Short Name)",
    cell: ({ getValue }) => <Box>{getValue<string>()}</Box>,
  },
  {
    id: "description",
    footer: "Rule Description",
    accessorFn: (row) => row.description,
    header: "Rule Description",
    cell: ({ getValue }) => <Box>{getValue<string>()}</Box>,
  },
  {
    id: "type*",
    footer: "Type",
    accessorFn: (row) => row.type || ViolationType.automated,
    header: "Type",
    cell: ({ getValue }) => <Box>{getValue<string>()}</Box>,
  },
  {
    id: "actRuleId",
    footer: "ACT Rule ID",
    accessorFn: (row) => row.actRuleId || "",
    header: "ACT Rule ID",
    cell: ({ getValue }) => <Box>{getValue<string>()}</Box>,
  },
  {
    id: "actRuleDescription",
    footer: "ACT Rule Description",
    accessorFn: (row) => row.actRuleDescription || "",
    header: "ACT Rule Description",
    cell: ({ getValue }) => <Box>{getValue<string>()}</Box>,
  },
  {
    id: "detailPrinciples*",
    footer: "Priniciples",
    accessorFn: (row) => row.detailPrinciples || "",
    header: "Priniciples",
    cell: ({ getValue }) => <Box>{getValue<string>()}</Box>,
  },
  {
    id: "detailSuccessCriteria*",
    footer: "Success Criteria",
    accessorFn: (row) => row.detailSuccessCriteria || "",
    header: "Success Criteria",
    cell: ({ getValue }) => <Box>{getValue<string>()}</Box>,
  },
  {
    id: "successCriteriaDescription",
    footer: "Success Criteria Description",
    accessorFn: (row) => row.successCriteriaDescription || "",
    header: "Success Criteria Description",
    cell: ({ getValue }) => <Box>{getValue<string>()}</Box>,
  },
  {
    id: "element",
    footer: "Element",
    accessorFn: (row) => row.element || "",
    header: "Element",
    cell: ({ getValue }) => <Box>{getValue<string>()}</Box>,
  },
  {
    id: "issueCategory",
    footer: "Issue Category",
    accessorFn: (row) => row.issueCategory || "",
    header: "Issue Category",
    cell: ({ getValue }) => <Box>{getValue<string>()}</Box>,
  },
  {
    id: "issueClassification",
    footer: "Issue Classification",
    accessorFn: (row) => row.issueClassification || "",
    header: "Issue Classification",
    cell: ({ getValue }) => <Box>{getValue<string>()}</Box>,
  },
  {
    id: "issueName",
    footer: "Issue Name",
    accessorFn: (row) => row.issueName || "",
    header: "Issue Name",
    cell: ({ getValue }) => <Box>{getValue<string>()}</Box>,
  },
  {
    id: "impact",
    footer: "Impact",
    accessorFn: (row) => row.impact || "",
    header: "Impact",
    cell: ({ getValue }) => <Box>{getValue<string>()}</Box>,
  },
  {
    id: "detailLevel",
    footer: "LEVEL",
    accessorFn: (row) => row.detailLevel || "",
    header: "LEVEL",
    cell: ({ getValue }) => <Box>{getValue<string>()}</Box>,
  },
  {
    id: "detailWcag2021",
    footer: "WCAG",
    accessorFn: (row) => row.detailWcag2021 || "",
    header: "WCAG",
    cell: ({ getValue }) => <Box>{getValue<string>()}</Box>,
  },
  {
    id: "detailSec508",
    footer: "Sec 508",
    accessorFn: (row) => row.detailSec508 || "",
    header: "Sec 508",
    cell: ({ getValue }) => <Box>{getValue<string>()}</Box>,
  },
  {
    id: "help",
    footer: "Help",
    accessorFn: (row) => row.help || "",
    header: "Help",
    cell: ({ getValue }) => <Box>{getValue<string>()}</Box>,
  },
  {
    id: "helpUrl",
    footer: "Help Url",
    accessorFn: (row) => row.helpUrl || "",
    header: "Help Url",
    cell: ({ getValue }) => <Box>{getValue<string>()}</Box>,
  },
  {
    id: "remediationSummary",
    footer: "Remediation Summary",
    accessorFn: (row) => row.remediationSummary || "",
    header: "Remediation Summary",
    cell: ({ getValue }) => <Box>{getValue<string>()}</Box>,
  },
  {
    id: "status",
    footer: "Status",
    accessorFn: (row) => row.status || "",
    header: "Status",
    cell: ({ getValue }) => <Box>{getValue<string>()}</Box>,
  },
  {
    id: "scanTime",
    footer: "Scan Time",
    accessorFn: (row) => row.scanTime || "",
    header: "Scan Time",
    cell: ({ getValue }) => <Box>{getValue<string>()}</Box>,
  },
  {
    id: "ruleStatus",
    footer: "Rule Status",
    accessorFn: (row) => row.ruleStatus || false,
    header: "Rule Status",
    cell: ({ row, getValue }) => (
      <RuleOrJiraStatusCell row={row} checked={getValue<boolean>()} />
    ),
  },
  {
    id: "jiraStatus",
    footer: "Jira Status",
    accessorFn: (row) => row.jiraStatus || false,
    header: "Jira Status",
    cell: ({ row, getValue }) => (
      <RuleOrJiraStatusCell
        row={row}
        checked={getValue<boolean>()}
        isRuleStatus={false}
      />
    ),
  },
];

const initialColumnVisibility = {
  // the other columns
  ...columns.reduce((acc, col) => ({ ...acc, [col.id as string]: false }), {}),
  select: true,
  "id*": true,
  description: true,
  "type*": true,
  "principles*": true,
  "successCriteria*": true,
  ruleStatus: true,
  jiraStatus: true,
};

export const RulesTable: React.FC<RulesTableProps> = ({ rulesData }) => {
  const [searchText, setSearchText] = useState("");
  const handleChangeSearch = useCallback(
    (searchText: string) => setSearchText(searchText.toLowerCase()),
    []
  );
  const filteredRulesData = useMemo(
    () =>
      searchText.length > 0
        ? rulesData.filter(
            (rule) =>
              rule.id.toLowerCase().includes(searchText) ||
              rule.detailSuccessCriteria?.toLowerCase().includes(searchText) ||
              rule.detailPrinciples?.toLowerCase().includes(searchText) ||
              rule.type?.toLowerCase().includes(searchText)
          )
        : rulesData,
    [rulesData, searchText]
  );
  return (
    <Table
      data={filteredRulesData}
      initialColumnVisibility={initialColumnVisibility}
      columns={columns}
      ActionsElement={RulesTableActions}
      FooterElement={RulesTableFooter}
      onSearchChange={handleChangeSearch}
      tableName="rules"
    />
  );
};

const RulesTableActions: React.FC<TableActionProps<ApplicationRuleMeta>> = ({
  table,
}) => {
  const selectedRows = table.getSelectedRowModel().rows;
  const { onUpdateRuleOrJiraStatus } = useContext(RulesPageContext);
  const handleEnableRules = useCallback(() => {
    const ruleIds = selectedRows.map((row) => row.original.id);
    onUpdateRuleOrJiraStatus &&
      ruleIds.length > 0 &&
      onUpdateRuleOrJiraStatus(ruleIds);
  }, [onUpdateRuleOrJiraStatus, selectedRows]);

  return (
    <Button disabled={!selectedRows.length} onClick={handleEnableRules}>
      ENABLE/DISABLE RULES
    </Button>
  );
};

const RulesTableFooter: React.FC<TableFooterProps<ApplicationRuleMeta>> = ({
  table,
}) => {
  return (
    <Group justify="end">
      <ExportToCSVButtonWithData
        data={table.getRowModel().rows.map((row) => row.original)}
        filenamePrefix="tableName"
        parserOpts={{
          fields: columns
            .filter(
              (col) => !["expand", "select", "actions"].includes(col.id || "")
            )
            .map((col) => ({
              label: col.header,
              value: col.id?.replace("*", ""),
            })),
        }}
      />
      <Button disabled>Export to PDF</Button>
    </Group>
  );
};

