import clsx from "clsx";
import React, { FC } from "react";

// Represents the configuration for each column in the table
interface TableColumn {
  header: string; // Column header text
  accessor: string; // Key to access the corresponding data in each row
  className?: string;
  render?: (data: any) => React.ReactNode; // Optional custom render function for the column
}

// Represents each row in the table
interface TableDataItem {
  id: string; // Unique identifier for the row
  [key: string]: any; // Additional data based on the columns' accessors
}

// Props for the StaticTable component
interface StaticTableProps {
  columns: TableColumn[]; // Array of TableColumn objects representing the table columns
  data: TableDataItem[]; // Array of TableDataItem objects representing the table rows
}

const StaticTable: FC<StaticTableProps> = ({ columns, data }) => {
  return (
    <table className="w-full border-separate border-0 border-slate-500">
      <thead className="bg-[#D9D9D9]">
        <tr>
          {columns.map((column, index) => (
            <th
              key={index}
              className="border-t-0 border-b-0 border-slate-600 py-1"
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index} className="text-center">
            {columns.map((column, colIndex) => (
              <td
                key={colIndex}
                className={clsx("border border-slate-700", column.className)}
              >
                {column.render
                  ? column.render(row[column.accessor]) // If a custom render function is provided, call it with the data value
                  : row[column.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StaticTable;
