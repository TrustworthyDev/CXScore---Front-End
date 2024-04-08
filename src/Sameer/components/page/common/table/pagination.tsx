import { CircleLeft } from "@/icons/CircleLeft";
import { CircleRight } from "@/icons/CircleRight";
import clsx from "clsx";
import { useEffect, useCallback } from "react";
import { VerticalSeparator } from "../../../atoms/seperator/vertical-separator";
import { SmallSpinner } from "../../../atoms/loading";
import { ActionIcon, Select } from "@mantine/core";

export const TablePaginationBar = ({
  pageCount,
  currentPage,
  setCurrentPage,
  totalRows,
  rowsPerPage,
  setRowsPerPage,
  loading,
  rowsPerPageSelection = ["10", "25", "50", "100"],
  selectedRowsCount,
  selectedRowName = "row",
  selectedRowNamePlural = "rows",
}: {
  pageCount: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalRows: number;
  rowsPerPage: number;
  setRowsPerPage: (rowsPerPage: number) => void;
  selectedRowsCount?: number;
  loading?: boolean;
  rowsPerPageSelection?: string[];
  selectedRowName?: string;
  selectedRowNamePlural?: string;
}) => {
  const hasPreviousPage = currentPage > 0;
  const hasNextPage = currentPage < pageCount - 1;

  const handleClickNext = () => hasNextPage && setCurrentPage(currentPage + 1);
  const handleClickPrevious = () =>
    hasPreviousPage && setCurrentPage(currentPage - 1);
  const handleChangeRowsPerPage = useCallback(
    (value: string | null) => {
      setRowsPerPage(parseInt(value ?? rowsPerPageSelection[0] ?? "10"));
    },
    [rowsPerPageSelection, setRowsPerPage]
  );

  const start = currentPage * rowsPerPage + 1;
  const end = Math.min((currentPage + 1) * rowsPerPage, totalRows);
  const range = `${start}-${end}`;

  useEffect(() => {
    // select first page if current page is out of range
    if (currentPage >= pageCount) {
      setCurrentPage(0);
    }
  }, [currentPage, pageCount, setCurrentPage]);

  return (
    <div className="flex flex-wrap items-center justify-end space-x-2 border bg-slate-100 px-4 py-2">
      <div className="mr-auto justify-start font-display text-xs">
        <div className="flex items-center space-x-2">
          {loading && <SmallSpinner className="!ml-0 !mr-0" />}
          <span>
            Showing {range} / {totalRows}
          </span>
          {selectedRowsCount != null && selectedRowsCount > 0 && (
            <>
              <VerticalSeparator className="!h-4" />
              <span>
                Selected {selectedRowsCount}{" "}
                {selectedRowsCount > 1
                  ? selectedRowNamePlural
                  : selectedRowName}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="font-display text-xs">Rows Per Page</div>
      <div className="relative">
        <Select
          aria-label="Change rows per page"
          variant="numberCenterSelect"
          size="xs"
          value={rowsPerPage.toString()}
          onChange={handleChangeRowsPerPage}
          data={rowsPerPageSelection}
          // size="xs"
          // style={{ width: rem(80) }}
        />
        {/* <button
          className="relative z-0 w-20 !bg-[#35ACEF] px-2 text-center text-sm text-white"
          aria-label="Change rows per page"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="flex-1 text-center font-bold">{rowsPerPage}</span>
          <CircleDown className="absolute right-0 top-0.5 !h-4 !stroke-white" />
        </button>
        {menuOpen && (
          <div
            ref={ref}
            className="absolute bottom-0 right-0 z-10 flex w-20 flex-col bg-white shadow-xl"
          >
            {rowsPerPageSelection.map((item) => (
              <button
                key={item}
                className={clsx(
                  "w-full py-0.5 text-center text-sm text-gray-700 hover:bg-blue-100",
                  rowsPerPage === item &&
                    "!bg-[#35ACEF] !text-white hover:text-white"
                )}
                onClick={() => {
                  setRowsPerPage(item);
                  setMenuOpen(false);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        )} */}
      </div>

      <VerticalSeparator className="!h-4" />
      <div className="font-display text-xs">
        Page {currentPage + 1}/{pageCount}
      </div>
      <ActionIcon
        aria-label="Previous Page"
        disabled={!hasPreviousPage}
        onClick={handleClickPrevious}
        variant="transparent"
      >
        <CircleLeft
          className={clsx(
            hasPreviousPage ? "stroke-brand-500" : "text-gray-400"
          )}
        />
      </ActionIcon>
      <ActionIcon
        aria-label="Next Page"
        disabled={!hasNextPage}
        onClick={handleClickNext}
        variant="transparent"
      >
        <CircleRight
          className={clsx(hasNextPage ? "stroke-brand-500" : "text-gray-400")}
        />
      </ActionIcon>
    </div>
  );
};
