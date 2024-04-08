import { Table } from "@tanstack/react-table";
import { useCallback, useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "../../../../lib/util/use-on-click-outside";
import { CirclePlusIcon } from "@/icons/CirclePlus";
import { ScanIcon } from "@/icons/ScanIcon";
import { Button } from "../../../atoms/button";
import { HorizontalSeparator } from "../../../atoms/seperator/horizontal-separator";
import { CircleClose } from "@/icons/CircleClose";
import { useKeydown } from "../../../../lib/util/use-keydown";

export const ColumnSelectionButtonWithDropdownMenu = <T extends object>({
  table,
  initialColumnVisibility = {},
  excludeColumns = [],
  showSearchIndicator = true,
}: {
  table: Table<T>;
  initialColumnVisibility?: Record<string, boolean>;
  excludeColumns?: string[];
  showSearchIndicator?: boolean;
}) => {
  const [isColumnSelectionOpen, setIsColumnSelectionOpen] = useState(false);

  const resetColumnVisibilityHandler = useCallback(() => {
    table.setColumnVisibility(initialColumnVisibility);
  }, []);

  const toggleColumnVisibiltyHandler =
    table.getToggleAllColumnsVisibilityHandler();

  const closeMenu = () => setIsColumnSelectionOpen(false);
  const columnSelectionRef = useRef<any>();
  useOnClickOutside(columnSelectionRef, closeMenu);
  useKeydown("Escape", closeMenu);

  // keep ref in view when opened
  useEffect(() => {
    const ref = columnSelectionRef.current;
    if (!isColumnSelectionOpen || !ref) return;
    ref.scrollIntoView({ behavior: "smooth" });
  }, [columnSelectionRef.current, isColumnSelectionOpen]);

  const isAllSelected = !!!Object.entries(
    table.getState().columnVisibility
  ).filter(([key, value]: [string, Boolean]) => !value).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsColumnSelectionOpen(!isColumnSelectionOpen)}
        className="flex items-center rounded-full p-2"
        type="button"
      >
        <CirclePlusIcon className="mr-1 h-4 w-4 !stroke-blue-600" />
        <span className="text-md whitespace-nowrap text-blue-700">
          Add Column
        </span>
      </button>
      {isColumnSelectionOpen && (
        <div
          ref={columnSelectionRef}
          className="absolute right-0 top-10 z-10 block w-[420px] items-start divide-y divide-gray-100 rounded-lg
                  border border-gray-300 bg-white shadow-lg"
        >
          <div className="flex items-center justify-between gap-2 rounded-t-lg bg-brand-600 py-3 px-2">
            <div className="whitespace-nowrap font-display text-lg font-bold text-white">
              Select columns to show
            </div>

            <div className="flex flex-row flex-wrap justify-center gap-2">
              <Button
                className="!px-[8px] py-1 text-xs"
                buttonProps={{
                  onClick: toggleColumnVisibiltyHandler,
                }}
              >
                {isAllSelected ? "De-select" : "Select All"}
              </Button>
              <Button
                className="!px-[8px] py-1 text-xs"
                buttonProps={{
                  onClick: resetColumnVisibilityHandler,
                }}
              >
                Reset
              </Button>
              <button
                aria-label="Close Menu"
                onClick={() => setIsColumnSelectionOpen(false)}
              >
                <CircleClose size={20} stroke="white" fill="white" />
              </button>
            </div>
          </div>
          {showSearchIndicator && (
            <div className="flex items-center px-2 py-1 text-right font-display text-sm text-red-600">
              Note:
              <ScanIcon aria-label="Searchable" height={"14px"} fill="black" />
              Indicates that the field is searchable
            </div>
          )}
          <HorizontalSeparator />
          <ul
            className="columns-2 space-y-1 p-2 text-left text-sm text-gray-700"
            aria-labelledby="dropdownDefaultButton"
          >
            {table.getAllLeafColumns().map((column) => {
              if (excludeColumns.includes(column.id)) return null;
              return (
                <li key={column.id} className="">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={column.getIsVisible()}
                      onChange={column.getToggleVisibilityHandler()}
                      className="mr-1 "
                    />
                    <div className="flex items-center">
                      {column.columnDef.footer as string}
                      {showSearchIndicator && !column.id.includes(".") && (
                        <ScanIcon
                          aria-label="Searchable"
                          height={"14px"}
                          fill="black"
                        />
                      )}
                    </div>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
