import { Checkbox, Flex } from "@mantine/core";
import { Row, Table } from "@tanstack/react-table";

export const TableSelectionHeader = <T,>({ table }: { table: Table<T> }) => {
  return (
    <Flex align="center" gap="xs" style={{ whiteSpace: "nowrap" }}>
      <Checkbox
        aria-label={
          table.getIsAllRowsSelected() ? "Unselect All rows" : "Select all rows"
        }
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
        disabled={table.getPrePaginationRowModel().rows.length === 0}
      />
    </Flex>
  );
};

export const TableSelectionCell = <T,>({ row }: { row: Row<T> }) => {
  return (
    <Flex
      align="center"
      gap="xs"
      justify="center"
      style={{ whiteSpace: "nowrap" }}
    >
      <Checkbox
        aria-label={
          row.getIsSelected() ? "Deselect this row" : "Select this row"
        }
        checked={row.getIsSelected()}
        indeterminate={row.getIsSomeSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    </Flex>
  );
};
