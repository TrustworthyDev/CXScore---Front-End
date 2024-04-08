import { Spinner } from "@/atoms/Spinner";
import { ArrowDownIcon } from "@/icons/ArrowDown";
import { ArrowUpIcon } from "@/icons/ArrowUp";
import {
  PaginationState,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { TablePaginationBar } from "./pagination";
import { ColumnSelectionButtonWithDropdownMenu } from "./column-selection-button-with-dropdown-menu";
import { ExportToCSVButtonWithData } from "./export-to-csv";
import { getApiViolationFields } from "../../../../lib/util/table-utils";

export const DuplicateTable = ({
  data,
  isLoading,
}: {
  data: ApiViolation[];
  isLoading: boolean;
}) => {
  const columnHelper = createColumnHelper<ApiViolation>();
  const columns = useMemo(
    () => [
      columnHelper.accessor("url", {
        id: "url",
        cell: (row) => row.getValue(),
        header: "URL",
        footer: "URL",
      }),
      columnHelper.accessor("elementType", {
        id: "elementType",
        cell: (row) => <span>{row.getValue()}</span>,
        header: "Element",
        footer: "Element",
      }),
      columnHelper.accessor("groupId", {
        id: "groupId",
        cell: (row) => <span className="text-xs">{row.getValue()}</span>,
        header: "Group ID",
        footer: "Group ID",
      }),
      columnHelper.accessor("id", {
        id: "id",
        cell: (row) => <span className="text-xs">{row.getValue()}</span>,
        header: "Violation ID",
        footer: "Violation ID",
      }),
      columnHelper.accessor("cssSelector", {
        id: "cssSelector",
        cell: (row) => (
          <div className="max-w-[300px] text-left">
            <pre className="whitespace-pre-wrap break-words text-xs">
              {row.getValue()}
            </pre>
          </div>
        ),
        header: "CSS Selector",
        footer: "CSS Selector",
      }),
      columnHelper.accessor("html", {
        id: "html",
        cell: (row) => (
          <div className="max-w-[300px] text-left">
            <pre className="whitespace-pre-wrap break-words text-xs">
              {row.getValue()}
            </pre>
          </div>
        ),
        header: "HTML",
        footer: "HTML",
      }),
    ],
    []
  );

  const initialColumnVisibility = useMemo(() => {
    const all = columns.reduce((acc, column) => {
      if (column.id) {
        acc[column.id] = true;
      }
      return acc;
    }, {} as Record<string, boolean>);

    return {
      ...all,
      html: false,
      groupId: false,
    };
  }, [columns]);

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "url",
      desc: false,
    },
  ]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: 5,
    pageIndex: 0,
  });

  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >(initialColumnVisibility);

  const table = useReactTable<ApiViolation>({
    columns,
    data,
    state: {
      sorting,
      pagination,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableSorting: true,
    enableSortingRemoval: false,
  });

  const length = data.length ?? 0;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Spinner className="!h-6 !w-6 !text-blue-600" />
        <h1>Loading duplicates...</h1>
      </div>
    );
  }

  if (length === 0) {
    return (
      <div>
        <h1>No duplicates found</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-md font-display font-semibold uppercase">
          Duplicates
        </div>
        <div className="flex items-center gap-2">
          <div>
            <ColumnSelectionButtonWithDropdownMenu
              initialColumnVisibility={initialColumnVisibility}
              showSearchIndicator={false}
              table={table}
            />
          </div>
          <ExportToCSVButtonWithData
            data={data}
            isLoading={isLoading}
            isError={false}
            filenamePrefix={
              "duplicates-groupId-" + data[0].groupId ?? "unknown"
            }
            parserOpts={{
              fields: getApiViolationFields({ dedupe: true }),
            }}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <th
                    key={header.id}
                    className={clsx(
                      // Bottom border is for visual header padding
                      "border-b-8 border-slate-50 text-sm font-normal uppercase",
                      header.id === "url" ? "w-2/5 text-left" : ""
                    )}
                  >
                    <button
                      className={clsx(
                        "flex w-full items-center border-l-0 border-r-0 border-t border-b bg-slate-100 px-2 py-1",
                        header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : "",
                        // this might break if we have headerGroups in {columns}
                        index === 0 &&
                          "rounded-l-3xl border-l border-t border-b",
                        index === headerGroup.headers.length - 1 &&
                          "rounded-r-3xl border-r border-t border-b",
                        ["url"].includes(header.id)
                          ? "justify-start"
                          : "justify-center"
                      )}
                      aria-label="Toggle sort"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {{
                        asc: (
                          <ArrowUpIcon
                            aria-label="Ascending"
                            className="fill-none !stroke-gray-800"
                            height={18}
                          />
                        ),
                        desc: (
                          <ArrowDownIcon
                            aria-label="Descending"
                            className="fill-none !stroke-gray-800"
                            height={18}
                          />
                        ),
                      }[header.column.getIsSorted() as string] ?? null}
                    </button>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="">
            {table.getRowModel().rows.map((row, rowIndex) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={clsx(
                      "border-b bg-slate-50 px-4 font-body",
                      cell.column.id === "url" ? "text-left" : "text-center",
                      rowIndex === 0 &&
                        "first:rounded-tl-2xl last:rounded-tr-2xl",
                      rowIndex === table.getRowModel().rows.length - 1 &&
                        "border-b-0 first:rounded-bl-2xl last:rounded-br-2xl"
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-2">
        <TablePaginationBar
          {...{
            rowsPerPageSelection: ["5", "10", "25", "50", "100"],
            totalRows: table.getCoreRowModel().rows.length,
            rowsPerPage: table.getState().pagination.pageSize,
            setRowsPerPage: table.setPageSize,
            pageCount: table.getPageCount(),
            currentPage: table.getState().pagination.pageIndex,
            setCurrentPage: table.setPageIndex,
          }}
        />
      </div>
    </div>
  );
};

