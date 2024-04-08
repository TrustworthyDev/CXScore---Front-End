import { ColumnDef, ExpandedState } from "@tanstack/react-table";
import { useMemo } from "react";
import {
  TableExpandCell,
  TableExpandHeader,
} from "../../../Sameer/components/page/common/table/expansion";
import { Table } from "@/atoms/Table/MantineTable";

export type InfoListProps<Model> = {
  columns: ColumnDef<Model>[];
  data: Model[];
  SubComponent?: ({ data }: { data: Model }) => React.ReactElement | null;
  onChangeExpandedRow?: (expandedState: ExpandedState) => void;
};

export function InfoList<Model extends object>({
  columns,
  data,
  SubComponent,
  onChangeExpandedRow,
}: InfoListProps<Model>) {
  const addedColumns = useMemo<ColumnDef<Model>[]>(
    () => [
      {
        id: "expand_control",
        footer: "Expand",
        header: ({ table }) => <TableExpandHeader table={table} />,
        cell: ({ row }) => <TableExpandCell row={row} />,
      },
      ...columns,
    ],
    [columns]
  );

  return (
    <Table
      data={data}
      columns={!SubComponent ? columns : addedColumns}
      withQuickSearch={false}
      withColumnVisibility={false}
      withBorder={false}
      ExpandElement={SubComponent}
      onChangeExpandedRow={onChangeExpandedRow}
    />
  );
}
