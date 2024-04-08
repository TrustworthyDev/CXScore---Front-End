import React, { Fragment, useCallback, useEffect, useState } from "react";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  flexRender,
  Table as ReactTable,
} from "@tanstack/react-table";
import { Box } from "../Box";
import { TableHeader } from "./TableHeader";
import { TablePaginationBar } from "../../../Sameer/components/page/common/table/pagination";
import { ColumnSelectionDropdown } from "./ColumnSelectionDropdown";
import { ExportToCSVButtonWithData } from "../../../Sameer/components/page/common/table/export-to-csv";
import { ActionIcon, Button, Input } from "@mantine/core";
import { SearchIcon } from "@/icons/Search";
import { useDebouncedState } from "@mantine/hooks";

export type TableActionProps<Model> = {
  table: ReactTable<Model>;
};

export type TableProps<Model extends object> = {
  tableName?: string;
  data: Model[];
  initialColumnVisibility: Record<string, boolean>;
  columns: ColumnDef<Model>[];
  ActionsElement?: React.FC<TableActionProps<Model>>;
  onSearchChange?: (searchText: string) => void;
};

export const isSafari = () =>
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export function Table<Model extends object>({
  data,
  initialColumnVisibility,
  columns,
  ActionsElement,
  onSearchChange,
}: TableProps<Model>): JSX.Element {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );
  const [searchVal, setSearchVal] = useDebouncedState("", 200);

  const handleChangeSearchVal = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchVal(event.currentTarget.value);
    },
    [setSearchVal]
  );

  useEffect(() => {
    onSearchChange?.(searchVal);
  }, [onSearchChange, searchVal]);
  // const [isColumnSelectionOpen, setIsColumnSelectionOpen] = useState(false);

  // const resetColumnVisibility = useCallback(
  //   () => setColumnVisibility(initialColumnVisibility),
  //   [setColumnVisibility]
  // );

  // const columnSelectionRef = useRef<HTMLDivElement>(null);

  // useOnClickOutside(columnSelectionRef, () => {
  //   setIsColumnSelectionOpen(false);
  // });

  const table = useReactTable<Model>({
    data,
    columns,
    state: {
      rowSelection,
      columnVisibility,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
  });

  return (
    <Box className="mx-auto max-w-full space-y-4">
      {/* Header */}
      <Box className="mx-auto flex max-w-full items-center justify-between gap-4">
        {/* <DebouncedSearchInput
          placeholder="Quick Search"
          className="min-w-[400px] flex-1"
          onChangeDebounced={onSearchChange}
        /> */}
        <Input
          aria-label="Quick search"
          defaultValue={searchVal}
          onChange={handleChangeSearchVal}
          placeholder="Quick search"
          rightSectionPointerEvents="all"
          rightSection={
            <ActionIcon aria-label="Quick search button" variant="transparent">
              <SearchIcon role="presentation" />
            </ActionIcon>
          }
          style={{ flex: 1 }}
        />
        <Box className="flex items-center gap-2">
          <Box className="flex flex-wrap items-center gap-2">
            {/* <Button
              disabled
              className="bg-gray-500 py-1 px-3 text-xs text-white"
            >
              Scan Now
            </Button>
            <Button
              disabled
              className="bg-blue-500 py-1 px-3 text-xs text-white"
            >
              Create Task
            </Button>
            <Button
              disabled
              className="bg-purple-500 py-1 px-3 text-xs text-white"
            >
              De-duplicate
            </Button> */}
            {ActionsElement && <ActionsElement table={table} />}
          </Box>
          <Box className="flex flex-wrap items-center gap-2">
            <ColumnSelectionDropdown
              table={table}
              initialColumnVisibility={initialColumnVisibility}
              excludeColumns={["expand", "select", "actions"]}
            />
          </Box>
        </Box>
      </Box>
      <Box className="">
        <Box className="overflow-x-auto overflow-y-visible pb-1">
          <table className="z-0 w-full">
            <thead className="relative z-0 space-x-4 whitespace-nowrap">
              {table.getHeaderGroups().map((headerGroup, index) => (
                <tr key={index}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHeader
                        key={header.id}
                        headerGroup={headerGroup}
                        header={header}
                      />
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="z-0">
              {data.length === 0 && (
                <tr>
                  <td></td>
                  <td></td>
                  <td className="text-center">No data available</td>
                </tr>
              )}
              {true &&
                table.getRowModel().rows.map((row) => {
                  return (
                    <Fragment key={row.id}>
                      <tr key={row.id + "1"} className="font-body text-sm">
                        {row.getVisibleCells().map((cell) => {
                          return (
                            <>
                              <td
                                key={cell.id}
                                className="border border-gray-300 px-2"
                              >
                                <Box className="py-1">
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                                </Box>
                              </td>
                            </>
                          );
                        })}
                      </tr>
                      <tr key={row.id + "2"} className="">
                        {row.getIsExpanded() && (
                          <td colSpan={row.getVisibleCells().length}>
                            <Box className="">Hello</Box>
                          </td>
                        )}
                      </tr>
                    </Fragment>
                  );
                })}
            </tbody>
          </table>
        </Box>
        <Box className="mx-auto max-w-full space-y-2 py-2">
          <TablePaginationBar
            {...{
              totalRows: table.getCoreRowModel().rows.length,
              rowsPerPage: table.getState().pagination.pageSize,
              setRowsPerPage: table.setPageSize,
              pageCount: table.getPageCount(),
              currentPage: table.getState().pagination.pageIndex,
              setCurrentPage: table.setPageIndex,
            }}
          />

          <Box className="flex w-full items-center justify-end space-x-4">
            <ExportToCSVButtonWithData
              data={data}
              filenamePrefix="tableName"
              parserOpts={{
                fields: columns
                  .filter(
                    (col) =>
                      !["expand", "select", "actions"].includes(col.id || "")
                  )
                  .map((col) => ({
                    label: col.header,
                    value: col.id?.replace("*", ""),
                  })),
              }}
            />
            <Button disabled>Export to PDF</Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

