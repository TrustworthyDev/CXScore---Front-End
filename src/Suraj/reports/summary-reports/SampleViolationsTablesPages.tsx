import { SetStateAction, useCallback, useEffect, useState } from "react";
import PriorityViolationsTable, { TableRow } from "./PriorityViolationsTable";
import { useSalesReportViolations } from "../../../Sameer/lib/violations/query";
import { ScreenReaderIcon2 } from "@/icons/ScreenReaderIcon2";
import { KeyboardIcon2 } from "@/icons/KeyboardIcon2";
import { ColorContrastIcon } from "@/icons/ColorContrast";
import { useSelector } from "react-redux";
import { selectSelectedScan } from "@/reduxStore/app/app.reducer";
import { useSelectedAppInfo } from "../../../Sameer/lib/application/use-application-data";
import { Loading } from "../../../Sameer/components/atoms/loading";
import HeadingOne from "../../component/common/headings/HeadingOne";
import { MiscellaneousIcon } from "@/icons/Miscellaneous";
import { Toggle } from "@/atoms/Toogle";
import HeadingThree from "../../component/common/headings/HeadingThree";
import { AudioVideoIcon } from "@/icons/AudioVideo";
import { RWDIcon } from "@/icons/RWD";
import { StructureIcon } from "@/icons/Structure";
import { UserSettingsIcon } from "@/icons/UserSettings";
import React from "react";

interface TableData {
  tableHeadingText: string;
  violationsCount: number;
  icon: React.ReactNode;
  tableRows: TableRow[];
  visible: boolean;
  category: string;
}
const iconMapping = {
  "Color Contrast": <ColorContrastIcon size={40} />,
  Guided: <MiscellaneousIcon size={35} />,
  "Screen Reader": <ScreenReaderIcon2 size={40} />,
  Keyboard: <KeyboardIcon2 size={40} />,
  "Audio & Video": <AudioVideoIcon size={40} fill="#545454" />,
  RWD: <RWDIcon size={40} fill="#545454" />,
  "Structure & Layout": <StructureIcon size={40} fill="#545454" />,
  "User Controls": <UserSettingsIcon size={40} fill="#545454" />,
};

const SampleViolationsTablesPages = ({}) => {
  const selectedApp = useSelectedAppInfo();
  const selectedScan = useSelector(selectSelectedScan);
  const [tabelDataList, setTableDataList] = useState<TableData[]>();

  const { data, isLoading, isError } = useSalesReportViolations(
    selectedApp?.appName ?? "",
    [selectedScan?.id ?? ""],
    []
  );

  const prepareData = useCallback(
    (filteredViolations: ApiViolation[] | undefined) => {
      const formattedViolationsData = filteredViolations?.map((item, index) => {
        const row: TableRow = {
          id: item.id,
          url: item.url,
          ruleId: item.ruleId,
          conformanceLevel: item.rule?.detailLevel,
          successCriteria: item.successCriteriaDescription,
          principleCategory: item.rule?.detailPrinciples,
          severity: item.severity,
          duplicateCount: item.dupCount,
          issueCategory: item.rule?.issueCategory,
        };
        return row;
      });

      return formattedViolationsData ?? [];
    },
    [data]
  );

  useEffect(() => {
    const tableData: SetStateAction<TableData[] | undefined> = [];
    if (data?.Violations) {
      Object.entries(data?.Violations).map(([key, violations]) =>
        tableData.push({
          category: key,
          tableHeadingText: key,
          violationsCount: data.Counts[key as keyof typeof data.Counts],
          icon: iconMapping[key as keyof typeof iconMapping],
          tableRows: prepareData(violations),
          visible: true,
        })
      );
    }
    setTableDataList(tableData);
  }, [data]);

  const handleToggle = useCallback(
    (category: string) => {
      if (tabelDataList) {
        const updatedList = tabelDataList.map((tableData: TableData) => {
          if (category === tableData.category)
            return { ...tableData, visible: !tableData.visible };
          return tableData;
        });
        setTableDataList(updatedList);
      }
    },
    [tabelDataList]
  );

  let count = 0;

  return (
    <div className="">
      {!isLoading ? (
        <div>
          <HeadingOne
            text="Sample Violations"
            className="pb-4 font-bold text-[#545454]"
          />
          {tabelDataList?.map((data, index) => (
            <div>
              <div className="hide-in-print flex items-center justify-end">
                <HeadingThree text={data.category} />
                <Toggle
                  checked={data.visible}
                  onChange={() => {
                    handleToggle(data.category);
                  }}
                />
              </div>
              <div className="hidden">{!data.visible && count++}</div>

              {data.visible ? (
                <div>
                  <PriorityViolationsTable
                    key={index}
                    tableNumber={index + 1 - count}
                    tableHeadingText={data.tableHeadingText}
                    violationsCount={data.violationsCount}
                    icon={data.icon}
                    tableRows={data.tableRows}
                  />
                  {index !== tabelDataList.length - 1 && (
                    <hr className="mb-6 mt-10" />
                  )}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default SampleViolationsTablesPages;
