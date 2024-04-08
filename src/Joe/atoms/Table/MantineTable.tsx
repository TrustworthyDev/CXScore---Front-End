import {
  ActionIcon,
  Box,
  Flex,
  Group,
  Input,
  Table as MantineTable,
  rem,
} from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import {
  ColumnDef,
  ExpandedState,
  OnChangeFn,
  PaginationState,
  Table as ReactTable,
  SortingState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

import { ArrowDownIcon } from "@/icons/ArrowDown";
import { ArrowUpIcon } from "@/icons/ArrowUp";
import { SearchIcon } from "@/icons/Search";
import { useLocalStorageState } from "~/Sameer/lib/util/use-local-storage-state";

import { ColumnSelectionDropdown } from "./ColumnSelectionDropdown";
import { TablePaginationBar } from "../../../Sameer/components/page/common/table/pagination";

export type TableActionProps<Model> = {
  table: ReactTable<Model>;
};

export type TableExpandProps<Model> = {
  data: Model;
};

export type TableFooterProps<Model> = {
  table: ReactTable<Model>;
};

export type TableSortingProps = {
  sorting: SortingState;
  setSorting: OnChangeFn<SortingState>;
  initialSorting?: SortingState;
};

export type TablePaginationProps = {
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  pageCount: number;
};

export type TableProps<Model extends object> = {
  tableName?: string;
  data: Model[];
  withBorder?: boolean;
  withQuickSearch?: boolean;
  withColumnVisibility?: boolean;
  initialColumnVisibility?: Record<string, boolean>;
  manualSortProps?: TableSortingProps;
  manualPaginationProps?: TablePaginationProps;
  columns: ColumnDef<Model>[];
  ActionsElement?: React.FC<TableActionProps<Model>>;
  ExpandElement?: React.FC<TableExpandProps<Model>>;
  FooterElement?: React.FC<TableFooterProps<Model>>;
  onSearchChange?: (searchText: string) => void;
  onChangeExpandedRow?: (expandedState: ExpandedState) => void;
  overrideTotalRowsForPagination?: number;
  isRefetching?: boolean;
};

export const isSafari = () =>
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export type TableRef = {
  init: () => void;
};

function TableInner<Model extends object>(
  {
    tableName = "-",
    data,
    withBorder = true,
    withQuickSearch = true,
    withColumnVisibility = true,
    manualSortProps,
    manualPaginationProps,
    initialColumnVisibility = {},
    columns,
    ActionsElement,
    ExpandElement,
    FooterElement,
    onSearchChange,
    onChangeExpandedRow,
    overrideTotalRowsForPagination,
    isRefetching,
  }: TableProps<Model>,
  ref: React.ForwardedRef<TableRef>,
): JSX.Element {
  const isManualSorting = !!manualSortProps;
  const isManualPagination = !!manualPaginationProps;
  const [rowSelection, setRowSelection] = useState({});
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const [columnVisibility, setColumnVisibility] = useLocalStorageState<
    Record<string, boolean>
  >(`${tableName}/columnVisibility`, initialColumnVisibility);
  const [sorting, setSorting] = useLocalStorageState<SortingState>(
    `${tableName}/sorting`,
    [],
  );

  const [searchVal, setSearchVal] = useDebouncedState("", 200);

  const handleChangeSearchVal = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchVal(event.currentTarget.value);
    },
    [setSearchVal],
  );

  useEffect(() => {
    onChangeExpandedRow && onChangeExpandedRow(expanded);
  }, [expanded, onChangeExpandedRow]);

  const table = useReactTable<Model>({
    data,
    columns,
    state: {
      expanded,
      rowSelection,
      columnVisibility,
      sorting: isManualSorting ? manualSortProps.sorting : sorting,
      ...(isManualPagination
        ? { pagination: manualPaginationProps.pagination }
        : {}),
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    // Sorting
    ...(isManualSorting
      ? {
          manualSorting: true,
          onSortingChange: manualSortProps.setSorting,
        }
      : {
          onSortingChange: setSorting,
          getSortedRowModel: getSortedRowModel(),
        }),
    // Pagination
    ...(isManualPagination
      ? {
          manualPagination: true,
          onPaginationChange: manualPaginationProps?.setPagination,
          pageCount: manualPaginationProps?.pageCount,
        }
      : {
          getPaginationRowModel: getPaginationRowModel(),
        }),
    onColumnVisibilityChange: setColumnVisibility,
    enableSorting: true,
    enableSortingRemoval: false,
    onExpandedChange: setExpanded,
  });

  useEffect(() => {
    onSearchChange?.(searchVal);
    table.setPageIndex(0);
  }, [onSearchChange, searchVal, table]);

  useImperativeHandle(ref, () => ({
    init: () => {
      table.setPageIndex(0);
    },
  }));

  return (
    <Box className="w-full">
      <Group>
        {withQuickSearch && (
          <Input
            aria-label="Quick search"
            defaultValue={searchVal}
            onChange={handleChangeSearchVal}
            placeholder="Quick search"
            rightSectionPointerEvents="all"
            rightSection={
              <ActionIcon
                aria-label="Quick search button"
                variant="transparent"
              >
                <SearchIcon role="presentation" />
              </ActionIcon>
            }
            style={{ flex: 1 }}
          />
        )}

        {ActionsElement && <ActionsElement table={table} />}
        {withColumnVisibility && (
          <ColumnSelectionDropdown
            table={table}
            initialColumnVisibility={initialColumnVisibility}
            excludeColumns={["expand", "select", "actions"]}
          />
        )}
      </Group>
      <MantineTable.ScrollContainer minWidth={100}>
        <MantineTable
          styles={{ th: centeredStyles, tr: centeredStyles }}
          withTableBorder={withBorder}
          withColumnBorders={withBorder}
          mt="md"
        >
          <MantineTable.Thead
            style={{
              background: "var(--mantine-color-gray-2)",
              zIndex: 2,
            }}
          >
            {table.getHeaderGroups().map((headerGroup, index) => (
              <MantineTable.Tr key={index}>
                {headerGroup.headers.map((header) => {
                  return (
                    <MantineTable.Th key={header.id}>
                      <Flex
                        style={{
                          cursor: header.column.getCanSort()
                            ? "pointer"
                            : undefined,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        tabIndex={header.column.getCanSort() ? 0 : undefined}
                        role={header.column.getCanSort() ? "button" : undefined}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                        {!!header.column.getIsSorted() && (
                          <Box style={{ height: rem(18), width: rem(18) }}>
                            {{
                              asc: (
                                <ArrowUpIcon
                                  className="fill-none !stroke-gray-800"
                                  height={rem(18)}
                                />
                              ),
                              desc: (
                                <ArrowDownIcon
                                  className="fill-none !stroke-gray-800"
                                  height={rem(18)}
                                />
                              ),
                            }[header.column.getIsSorted() as string] ?? null}
                          </Box>
                        )}
                      </Flex>
                    </MantineTable.Th>
                  );
                })}
              </MantineTable.Tr>
            ))}
          </MantineTable.Thead>
          <MantineTable.Tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <Fragment key={row.id}>
                  <MantineTable.Tr
                    key={row.id + "1"}
                    bg={
                      Object.entries(rowSelection).some(
                        ([key, val]) => key === row.id && val === true,
                      )
                        ? "var(--mantine-color-blue-light)"
                        : undefined
                    }
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <MantineTable.Td key={cell.id} py="xs">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </MantineTable.Td>
                      );
                    })}
                  </MantineTable.Tr>
                  <MantineTable.Tr key={row.id + "2"} className="">
                    {row.getIsExpanded() && ExpandElement && (
                      <MantineTable.Td colSpan={row.getVisibleCells().length}>
                        <div className="ml-2 border-l-8 border-blue-400 border-opacity-40 pl-2">
                          <ExpandElement data={row.original} />
                        </div>
                      </MantineTable.Td>
                    )}
                  </MantineTable.Tr>
                </Fragment>
              );
            })}
          </MantineTable.Tbody>
        </MantineTable>
      </MantineTable.ScrollContainer>
      <TablePaginationBar
        {...{
          totalRows: Math.max(
            overrideTotalRowsForPagination ?? 0,
            table.getCoreRowModel().rows.length,
          ),
          rowsPerPage: table.getState().pagination.pageSize,
          setRowsPerPage: table.setPageSize,
          pageCount: table.getPageCount(),
          currentPage: table.getState().pagination.pageIndex,
          setCurrentPage: table.setPageIndex,
          loading: isRefetching ?? false,
        }}
      />
      {FooterElement && (
        <Box mt="md">
          <FooterElement table={table} />
        </Box>
      )}
    </Box>
  );
}

const centeredStyles: React.CSSProperties = {
  textAlign: "center",
};

export const Table = React.forwardRef(TableInner) as <Model extends object>(
  props: TableProps<Model> & { ref?: React.ForwardedRef<TableRef> },
) => ReturnType<typeof TableInner>;

