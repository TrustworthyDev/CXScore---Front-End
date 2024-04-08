import React from "react";
import { Box } from "../Box";
import clsx from "clsx";

export type ListProps<T> = {
  data: T[];
  renderRow?: (rowData: T, index: number) => React.ReactNode;
  RowElement?: (props: ListRowElementProps<T>) => React.ReactElement | null;
  className?: string;
};
export const List = <T extends object>({
  data,
  renderRow,
  RowElement,
  className,
}: ListProps<T>) => {
  return (
    <Box flex flexDirection="col" className={clsx(className)}>
      {renderRow
        ? data.map(renderRow)
        : RowElement && data.map((row) => <RowElement row={row} />)}
    </Box>
  );
};
