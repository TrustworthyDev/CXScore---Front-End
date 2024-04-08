import { CircleDown } from "@/icons/CircleDown";
import { CircleUp } from "@/icons/CircleUp";
import { ActionIcon } from "@mantine/core";
import { Row, Table } from "@tanstack/react-table";

export const TableExpandHeader = <Model,>({
  table,
}: {
  table: Table<Model>;
}) => {
  if (!table.getCanSomeRowsExpand()) {
    return <></>;
  }
  return (
    <ActionIcon
      aria-label="Expand & collapse all rows"
      onClick={table.getToggleAllRowsExpandedHandler()}
    >
      {table.getIsAllRowsExpanded() ? (
        <CircleUp className={"h-5 w-5"} />
      ) : (
        <CircleDown className={"h-5 w-5"} />
      )}
    </ActionIcon>
  );
};

export const TableExpandCell = <Model,>({ row }: { row: Row<Model> }) => {
  if (!row.getCanExpand()) {
    return <></>;
  }
  return (
    <ActionIcon
      aria-label="Expand & collapse row"
      onClick={row.getToggleExpandedHandler()}
    >
      {row.getIsExpanded() ? (
        <CircleUp className={"h-5 w-5"} />
      ) : (
        <CircleDown className={"h-5 w-5"} />
      )}
    </ActionIcon>
  );
};
