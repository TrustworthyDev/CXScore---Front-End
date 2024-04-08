import { Button } from "@/atoms";
import { DownloadIcon } from "@/icons/Download";
import React, { FC } from "react";

interface TableDataItem {
  id: string;
  label: string;
  data?: any[] | null;
  disabled: boolean;
}

interface SitemapTableProps {
  tableData: TableDataItem[];
  selectedRows: String[];
  handleRowSelection: (id: String) => void;
  allSitemapFilter: () => void;
  handleDownloadSitemap: (id: String) => void;
  disableDownload: boolean;
}

const SitemapTable: FC<SitemapTableProps> = ({
  tableData,
  selectedRows,
  handleRowSelection,
  allSitemapFilter,
  handleDownloadSitemap,
  disableDownload,
}) => {
  return (
    <table className="w-full border-separate border-0 border-slate-500">
      <thead className="bg-[#D3E2FB]">
        <tr>
          <th className="border-t-0 border-b-0 border-slate-600 py-1">
            <input
              type="checkbox"
              onChange={allSitemapFilter}
              checked={selectedRows.length === tableData.length}
              disabled={tableData.some((entry) => entry.disabled === true)}
            />
          </th>
          <th className="border-t-0 border-b-0 border-slate-600">Sitemap</th>
          <th className="border-t-0 border-b-0 border-slate-600">Download</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, index) => (
          <tr key={index} className="text-center">
            <td className="border border-slate-700">
              <input
                type="checkbox"
                onChange={() => handleRowSelection(row?.id)}
                checked={selectedRows.includes(row?.id)}
                disabled={row?.disabled}
              />
            </td>
            <td className="border border-slate-700">{row.label}</td>
            <td className="border border-slate-700">
              <div className="flex justify-center">
                <button
                  aria-label="Sitemap Download Button"
                  disabled={disableDownload}
                  className={`${disableDownload ? "cursor-not-allowed" : ""}`}
                  onClick={() => {
                    handleDownloadSitemap(row?.id);
                  }}
                >
                  <DownloadIcon
                    fill={!disableDownload ? "#4578DC" : "#BBBBBB"}
                  />
                </button>
              </div>
            </td>
            {/* <td className="border border-slate-700">
              {index == 1 ? (
                <div className="flex justify-center">
                  <button
                    aria-label="Sitemap Delete Button"
                    className="text-rose-600"
                    onClick={() => {
                      handleDeleteSitemap(row?.id);
                    }}
                  >
                    Delete Sitemap
                  </button>
                </div>
              ) : null}
            </td> */}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SitemapTable;
