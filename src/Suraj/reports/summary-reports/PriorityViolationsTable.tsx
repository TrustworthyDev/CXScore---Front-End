import React, { useState } from "react";
import StaticTable from "../../component/common/tables/StaticTable";
import "./SummaryReport.css";

export enum Severity {
  Critical = "Critical",
  SERIOUS = "Serious",
  Moderate = "Moderate",
  Minor = "Minor",
}

const SeverityColour = {
  [Severity.Critical]: "bg-[#FF4040]",
  [Severity.SERIOUS]: "bg-[#FFA113]",
  [Severity.Moderate]: "bg-[#6389D3]",
  [Severity.Minor]: "bg-[#888888]",
};

export interface TableRow {
  id: string;
  url: string;
  ruleId: string | undefined;
  conformanceLevel: string | undefined;
  successCriteria: string | undefined;
  principleCategory: string | undefined;
  severity: string | undefined;
  duplicateCount: string | number | undefined;
  issueCategory: string | undefined;
}

interface PriorityViolationsTableProps {
  tableNumber: number;
  tableHeadingText: string;
  violationsCount: number | string | undefined;
  icon: React.ReactNode;
  tableRows: TableRow[];
}

interface ColumnVisibility {
  [key: string]: boolean;
}

const PriorityViolationsTable: React.FC<PriorityViolationsTableProps> = ({
  tableNumber,
  tableHeadingText,
  violationsCount,
  icon,
  tableRows,
}) => {
  // Define the columns for the PriorityViolationsTable
  const initialColumnVisibility: ColumnVisibility = {
    url: true,
    success_criteria: true,
    principle_category: true,
    severity: true,
    duplicate_count: true,
    rule_id: true,
    conformance_level: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  // Toggle the visibility of a column
  const toggleColumnVisibility = (columnId: string) => {
    setColumnVisibility((prevState) => ({
      ...prevState,
      [columnId]: !prevState[columnId],
    }));
  };

  // Define the columns for the table based on the visibility settings
  const columns = [
    {
      id: "ruleId",
      header: "Rule Id",
      accessor: "ruleId",
      isVisible: columnVisibility["rule_id"],
      className: "w-3/12",
      render: (ruleId: string) => <div className="textSR p-1">{ruleId}</div>,
    },
    {
      id: "success_criteria",
      header: "Success Criteria",
      accessor: "successCriteria",
      isVisible: columnVisibility["success_criteria"],
      className: "w-4/12",
      render: (successCriteria: string) => (
        <div className="textSR p-1">{successCriteria}</div>
      ),
    },
    {
      id: "conformanceLevel",
      header: "Conformance Level",
      accessor: "conformanceLevel",
      isVisible: columnVisibility["conformance_level"],
      className: "w-1/12",
      render: (conformanceLevel: string) => (
        <div className="textSR p-1">{conformanceLevel}</div>
      ),
    },
    {
      id: "principle_category",
      header: "Principle Category",
      accessor: "principleCategory",
      isVisible: columnVisibility["principle_category"],
      className: "w-2/12",
      render: (principleCategory: string) => (
        <div className="textSR p-1">{principleCategory}</div>
      ),
    },
    {
      id: "severity",
      header: "Severity",
      accessor: "severity",
      isVisible: columnVisibility["severity"],
      className: "w-1/6",
      render: (severity: string) => (
        <div
          className={SeverityColour[severity as keyof typeof SeverityColour]}
        >
          <div className="textSR p-4 text-white">{severity}</div>
        </div>
      ),
    },
    {
      id: "duplicate_count",
      header: "Duplicate Count",
      accessor: "duplicateCount",
      isVisible: columnVisibility["duplicate_count"],
      className: "w-1/6",
      render: (duplicateCount: string) => (
        <div className="textSR p-1">{duplicateCount}</div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-2 flex w-1/2 items-center justify-start">
        <div className="mr-4 flex w-1/12 items-center justify-center bg-[#35ACEF] py-2 text-white">
          {tableNumber}
        </div>
        <div className="flex w-6/12 items-center justify-center bg-[#35ACEF] py-2 text-white">
          {tableHeadingText}
        </div>
        {violationsCount !== undefined && (
          <div className="mr-5 flex w-2/12 items-center justify-center bg-[#F86F80] p-2 text-white">
            {violationsCount}
          </div>
        )}
        {icon && <div className="">{icon}</div>}
      </div>

      <StaticTable
        columns={columns.filter((column) => column.isVisible)}
        data={tableRows}
      />
    </div>
  );
};

export default PriorityViolationsTable;
