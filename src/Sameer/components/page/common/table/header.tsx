import { ArrowDownIcon } from "@/icons/ArrowDown";
import { ArrowUpIcon } from "@/icons/ArrowUp";
import { Header, Table, flexRender } from "@tanstack/react-table";
import clsx from "clsx";
import { useCallback } from "react";

export const TableHeader = ({
  header,
  ...props
}: {
  table: Table<any>;
  header: Header<any, unknown>;
  headerGroup?: any;
  thClassName?: string;
  innerClassName?: string;
}) => {
  const handleSortClick = useCallback(() => {
    if (header.column.getCanSort()) {
      header.column.toggleSorting();
    }
  }, []);

  return (
    <th
      key={header.id}
      className={clsx(
        "border border-gray-300 bg-slate-100 font-display text-sm font-normal",
        props.thClassName
      )}
      colSpan={header.colSpan}
    >
      {header.isPlaceholder ? null : (
        <button
          onClick={handleSortClick}
          aria-label="Toggle Sort"
          disabled={!header.column.getCanSort()}
          className={clsx(
            "relative flex w-full items-center justify-center space-x-1 px-1 py-1",
            props.innerClassName
          )}
        >
          <div className="uppercase">
            {flexRender(header.column.columnDef.header, header.getContext())}
          </div>
          {header.column.getIsSorted() ? (
            header.column.getIsSorted() === "asc" ? (
              <ArrowUpIcon
                aria-label="Ascending"
                className="h-4 w-4 stroke-gray-800"
              />
            ) : (
              <ArrowDownIcon
                aria-label="Descending"
                className="h-4 w-4 stroke-gray-800"
              />
            )
          ) : (
            <></>
          )}
        </button>
      )}
    </th>
  );
};

// const TableHeaderActions = ({
//   header,
//   table,
// }: {
//   header: Header<ApiViolation, unknown>;
//   table: TableType<Model>;
// }) => {
//   const availableFiltersQuery = useSelectedAppViolationsCountAvailableFields();

//   const handleSortAsc = useCallback(() => {
//     table.setSorting([
//       {
//         id: header.column.id,
//         desc: false,
//       },
//     ]);
//   }, [header, table]);

//   const handleSortDesc = useCallback(() => {
//     table.setSorting([
//       {
//         id: header.column.id,
//         desc: true,
//       },
//     ]);
//   }, [header, table]);

//   if (availableFiltersQuery.isLoading) {
//     return (
//       <div className="space-y-2 py-2 px-2">
//         <Skeleton className="h-8 " />
//         <Skeleton className="h-8 " />
//         <HorizontalSeparator />
//         <Skeleton className="h-20 " />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-2 py-2 text-start">
//       <div className="space-y-1 font-body text-sm capitalize">
//         <div>
//           <button
//             onClick={handleSortAsc}
//             className="mb-1 flex items-center px-2"
//           >
//             Sort A-Z
//             <ArrowUpIcon className="h-4 w-4 stroke-gray-800" />
//           </button>
//           <HorizontalSeparator />
//         </div>

//         <div>
//           <button
//             onClick={handleSortDesc}
//             // className="mb-1 flex items-center px-2"
//             className="flex items-center px-2"
//           >
//             Sort Z-A
//             <ArrowDownIcon className="h-4 w-4 stroke-gray-800" />
//           </button>
//           {/* <HorizontalSeparator /> */}
//         </div>
//       </div>

//       <div className="space-y-2 px-2">
//         <div className="flex items-center gap-2">
//           <button className="font-body text-xs capitalize text-blue-600 underline">
//             Select All
//           </button>
//           <button className="font-body text-xs capitalize text-blue-600 underline">
//             Clear
//           </button>
//         </div>

//         <div className="flex w-full items-center rounded-3xl border py-1 text-sm">
//           <input
//             disabled={availableFilters?.length === 0}
//             placeholder="Search"
//             className={clsx(
//               "w-full rounded-l-3xl px-2 focus:outline-none focus:ring-0",
//               { "cursor-not-allowed": availableFilters?.length === 0 }
//             )}
//           />
//           <div className="px-2">
//             <SearchAlternateIcon className="h-4 w-4" />
//           </div>
//         </div>

//         <div className="px-2">
//           <ul className="space-y-1 font-body normal-case">
//             {availableFilters && availableFilters.length > 0 ? (
//               availableFilters.map((f) => (
//                 <li key={f.value}>
//                   <div className="flex items-center justify-start">
//                     <input
//                       id={f.value}
//                       type="checkbox"
//                       className="mr-1 inline-block"
//                       value={f.value}
//                     />
//                     <label
//                       htmlFor={f.value}
//                       className="m-0 whitespace-pre-wrap p-0 leading-tight"
//                     >
//                       {f.value}
//                     </label>
//                   </div>
//                 </li>
//               ))
//             ) : (
//               <li className="text-gray-400">No filters available</li>
//             )}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// const SortableColumnIds = [...ViolationsFieldsAvailableForFilter, "dupCount"];

// const TableHeader = ({
//   header,
//   table,
// }: {
//   headerGroup: any;
//   header: Header<ApiViolation, unknown>;
//   table: TableType<Model>;
// }) => {
//   const [menuOpen, setMenuOpen] = useState(false);

//   const closeMenu = () => setMenuOpen(false);
//   const ref = useRef<HTMLDivElement>(null);
//   useOnClickOutside(ref, closeMenu);
//   useKeydown("Escape", closeMenu);

//   return (
//     <th
//       key={header.id}
//       className={`border border-gray-300 bg-slate-100 font-display text-sm font-normal uppercase`}
//       colSpan={header.colSpan}
//     >
//       {header.isPlaceholder ? null : (
//         <div className="relative flex items-center justify-center space-x-1 px-1 py-2">
//           <div className="">
//             {header.column.getCanSort() && header.column.getIsSorted() ? (
//               header.column.getIsSorted() === "asc" ? (
//                 <ArrowUpIcon
//                   aria-label="Ascending"
//                   className="h-4 w-4 stroke-gray-800"
//                 />
//               ) : (
//                 <ArrowDownIcon
//                   aria-label="Descending"
//                   className="h-4 w-4 stroke-gray-800"
//                 />
//               )
//             ) : (
//               <></>
//             )}
//           </div>
//           <div>
//             {flexRender(header.column.columnDef.header, header.getContext())}
//           </div>
//           {SortableColumnIds.includes(header.column.id) && (
//             <>
//               <button
//                 aria-label="Filter and Sort Menu"
//                 onClick={() => setMenuOpen(!menuOpen)}
//               >
//                 <FilterIcon className="!stroke-gray-700" />
//               </button>

//               {menuOpen && (
//                 <div
//                   ref={ref}
//                   className="absolute right-0 top-10 z-50 w-[250px] rounded-xl border-2 bg-slate-50 shadow-xl"
//                 >
//                   <TableHeaderActions header={header} table={table} />
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       )}
//     </th>
//   );
// };
