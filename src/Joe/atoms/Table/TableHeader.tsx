import { ArrowDownIcon } from "@/icons/ArrowDown";
import { ArrowUpIcon } from "@/icons/ArrowUp";
import { FilterIcon } from "@/icons/Filter";
import { SearchAlternateIcon } from "@/icons/SearchAlternate";
import { flexRender, Row } from "@tanstack/react-table";
import clsx from "clsx";
import React, { useRef, useState } from "react";
import { Box } from "../Box";
import { Separator } from "../Separator";
import { Skeleton } from "../../../Sameer/components/atoms/loading/skeleton";
import { useOnClickOutside } from "../../../Sameer/lib/util/use-on-click-outside";
import { useViolationsCountAvailableFields } from "../../../Sameer/lib/violations/count";

const violationFieldsAvailableForFilter = [
  "url",
  "rule.detailSuccessCriteria",
  "rule.detailPrinciples",
  "rule.detailWcag2021",
  "rule.detailLevel",
  "rule.name",
  "rule.issueCategory",
  "rule.issueClassification",
  "rule.issueName",
  "rule.impact",
  "rule.type",
  "rule.element",
  "rule.detailSec508",

  "actRuleId",
  "ticketStatus",
];

export type TableHeaderActionsProps = {
  header: any;
};

export const TableHeaderActions: React.FC<TableHeaderActionsProps> = ({
  header,
}) => {
  const availableFiltersQuery = useViolationsCountAvailableFields();

  const availableFilters = availableFiltersQuery.data?.filter(
    (filter) => filter.field === header.column.id
  )[0]?.values;

  if (availableFiltersQuery.isLoading) {
    return (
      <Box className="space-y-2 py-2 px-2">
        <Skeleton className="h-8 " />
        <Skeleton className="h-8 " />
        <Separator />
        <Skeleton className="h-20 " />
      </Box>
    );
  }

  return (
    <Box className="space-y-2 py-2 text-start">
      <Box className="space-y-1 font-body text-sm capitalize">
        <Box>
          <button className="mb-1 flex items-center px-2">
            Sort A-Z
            <ArrowUpIcon className="h-4 w-4 stroke-gray-800" />
          </button>
          <Separator />
        </Box>

        <Box>
          <button className="mb-1 flex items-center px-2">
            Sort Z-A
            <ArrowDownIcon className="h-4 w-4 stroke-gray-800" />
          </button>
          <Separator />
        </Box>
      </Box>

      <Box className="space-y-2 px-2">
        <Box className="flex items-center gap-2">
          <button className="font-body text-xs capitalize text-blue-600 underline">
            Select All
          </button>
          <button className="font-body text-xs capitalize text-blue-600 underline">
            Clear
          </button>
        </Box>

        <Box className="flex w-full items-center rounded-3xl border py-1 text-sm">
          <input
            disabled={availableFilters?.length === 0}
            placeholder="Search"
            className={clsx(
              "w-full rounded-l-3xl px-2 focus:outline-none focus:ring-0",
              { "cursor-not-allowed": availableFilters?.length === 0 }
            )}
          />
          <Box className="px-2">
            <SearchAlternateIcon className="h-4 w-4" />
          </Box>
        </Box>

        <Box className="px-2">
          <ul className="space-y-1 font-body normal-case">
            {availableFilters && availableFilters.length > 0 ? (
              availableFilters.map((f) => (
                <li key={f.value}>
                  <Box className="flex items-center justify-start">
                    <input
                      id={f.value}
                      type="checkbox"
                      className="mr-1 inline-block"
                      value={f.value}
                    />
                    <label
                      htmlFor={f.value}
                      className="m-0 whitespace-pre-wrap p-0 leading-tight"
                    >
                      {f.value}
                    </label>
                  </Box>
                </li>
              ))
            ) : (
              <li className="text-gray-400">No filters available</li>
            )}
          </ul>
        </Box>
      </Box>
    </Box>
  );
};

export type TableHeaderProps = {
  header: any;
  headerGroup: any;
};

export const TableHeader: React.FC<TableHeaderProps> = ({ header }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setMenuOpen(false));

  return (
    <th
      key={header.id}
      className={`border border-gray-300 bg-slate-100 font-display text-sm font-normal`}
      colSpan={header.colSpan}
    >
      {header.isPlaceholder ? null : (
        <Box
          flex
          className="relative items-center justify-center space-x-1 px-1 py-2"
        >
          <Box>
            {flexRender(header.column.columnDef.header, header.getContext())}
          </Box>
          {violationFieldsAvailableForFilter.includes(header.column.id) && (
            <>
              <button onClick={() => setMenuOpen(!menuOpen)}>
                <FilterIcon className="!stroke-gray-700" />
              </button>

              {menuOpen && (
                <Box
                  ref={ref}
                  className="absolute right-0 top-10 z-50 w-[250px] rounded-xl border-2 bg-slate-50 shadow-xl"
                >
                  <TableHeaderActions header={header} />
                </Box>
              )}
            </>
          )}
        </Box>
      )}
    </th>
  );
};
