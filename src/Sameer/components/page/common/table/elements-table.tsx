import { ValidateIcon } from "@/icons/Validate";
import {
  CellContext,
  ColumnDef,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { Skeleton } from "../../../atoms/loading/skeleton";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectApplicationInfo,
  selectSelectedScan,
} from "@/reduxStore/app/app.reducer";
import { getValidateUrl } from "@/utils/navigateUtils";
import { Table } from "@/atoms/Table/MantineTable";
import { Text, rem } from "@mantine/core";

type Model = {
  element: string;
  count: number;
};

const Actions = ({ row }: { row: CellContext<Model, unknown> }) => {
  const selectedApplicationId = useSelector(selectApplicationInfo)?.appId ?? "";
  const selectedScanId = useSelector(selectSelectedScan)?.id || "";

  const validateUrl = getValidateUrl({
    appId: selectedApplicationId,
    scanId: selectedScanId,
    stateId: "",
    element: row.row.original.element,
    url: "",
    violationId: "",
    ruleId: "",
    isAutomated: true,
  });

  return (
    <div className="flex items-center justify-center gap-1 py-1">
      <Link to={validateUrl} title="Validate">
        <ValidateIcon className="h-6 w-6" />
      </Link>
    </div>
  );
};

export const ElementsTable = (props: {
  data: Model[];
  isLoading?: boolean;
}) => {
  const columns: ColumnDef<Model>[] = useMemo(
    () => [
      {
        id: "index",
        cell: (row) => {
          return <Text>{row.cell.row.index + 1}</Text>
        },
        header: "No",
        footer: "No",
      },
      {
        id: "element",
        accessorFn: (row) => row.element,
        cell: (row) => (
          <Text>{row.getValue<string>()}</Text>
        ),
        header: "Element",
        footer: "Element",
      },
      {
        id: "count",
        accessorFn: (row) => row.count,
        cell: (row) => <Text>{row.getValue<string>()}</Text>,
        header: "Violations",
        footer: "Violations",
      },

      {
        id: "actions",
        cell: (row) => <Actions row={row} />,
        header: "Devtools",
        footer: "Devtools",
      },
    ],
    []
  );

  if (props.isLoading) {
    return (
      <div className="w-full space-y-2">
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} className="!h-4 !w-full" />
        ))}
      </div>
    );
  }

  if (props.data.length === 0) {
    return (
      <div className="py-2">
        <p>No elements found</p>
      </div>
    );
  }
  return (
    <Table
      data={props.data}
      withBorder={false}
      withColumnVisibility={false}
      columns={columns}
    />
  );
};
