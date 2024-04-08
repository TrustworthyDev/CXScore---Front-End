import ViolationStudio from "./ViolationStudio";
import { useSalesReportViolations } from "../../../Sameer/lib/violations/query";
import { useSelectedAppInfo } from "../../../Sameer/lib/application/use-application-data";
import { useSelector } from "react-redux";
import { selectSelectedScan } from "@/reduxStore/app/app.reducer";
import { Loading } from "../../../Sameer/components/atoms/loading";
import HeadingOne from "../../component/common/headings/HeadingOne";
import { SetStateAction, useCallback, useEffect, useState } from "react";
import HeadingThree from "../../component/common/headings/HeadingThree";
import { Toggle } from "@/atoms/Toogle";
import React from "react";

interface PreviewData {
  violations: ApiViolation[];
  totalCount: number;
  visible: boolean;
  category: string;
}

const ViolationStudioList = () => {
  const [previewDataList, setPreviewDataList] = useState<PreviewData[]>([]);
  const selectedApp = useSelectedAppInfo();
  const selectedScan = useSelector(selectSelectedScan);

  const { data, isLoading, isError } = useSalesReportViolations(
    selectedApp?.appName ?? "",
    [selectedScan?.id ?? ""],
    []
  );

  useEffect(() => {
    const previewData: SetStateAction<PreviewData[]> = [];
    if (data?.Violations)
      Object.entries(data?.Violations).map(([key, violations]) =>
        previewData.push({
          violations: violations,
          totalCount: data.Counts[key as keyof typeof data.Counts],
          visible: true,
          category: key,
        })
      );
    setPreviewDataList(previewData);
  }, [data]);

  const handleToggle = useCallback(
    (category: string) => {
      if (previewDataList) {
        const updatedList = previewDataList.map((previewData: PreviewData) => {
          if (category === previewData.category)
            return { ...previewData, visible: !previewData.visible };
          return previewData;
        });
        setPreviewDataList(updatedList);
      }
    },
    [previewDataList]
  );

  let count = 0;

  return (
    <div className="">
      {!isLoading ? (
        <div>
          <HeadingOne
            text="Guided Studio"
            className="pb-4 font-bold text-[#545454]"
          />
          {previewDataList.map((data, index) => (
            <div key={index}>
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
              {data.visible && (
                <div>
                  <ViolationStudio
                    violations={data.violations}
                    totalCount={data.totalCount}
                    categoryNumber={index + 1 - count}
                  />
                  {<hr className="mt-10 mb-6" />}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default ViolationStudioList;
