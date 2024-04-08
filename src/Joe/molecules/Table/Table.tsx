import React from "react";
import { Box } from "@/atoms/Box";
import clsx from "clsx";

export type TableProps<T> = {
  header: React.ReactNode;
  tableData: T[];
  renderRow: (row: T, index: number) => React.ReactNode;
  colsCnt: number;
  className?: string;
};

export const Table = <T extends object>({
  header,
  tableData,
  renderRow,
  colsCnt,
  className,
}: TableProps<T>) => {
  return (
    <Box
      className={clsx("grid", className)}
      //style={{ gridTemplateColumns: `repeat(${colsCnt}, minmax(0, 1fr))` }}
    >
      {header}
      {tableData.map(renderRow)}
    </Box>
  );
};
