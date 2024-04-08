import React, { useRef, useState } from "react";
import { VerticalSeparator } from "../../../Sameer/components/atoms/seperator/vertical-separator";
import HeadingTwo from "../../component/common/headings/HeadingTwo";
import HeadingThree from "../../component/common/headings/HeadingThree";
import ViolationPreview from "./ViolationPreview";
import { ExternalLink } from "../../../Sameer/components/atoms/external-link/external-link";
import { WarningIcon } from "@/icons/Warning";
import { CircleDown } from "@/icons/CircleDown";
import { Button } from "@/atoms";
import { useKeydown } from "../../../Sameer/lib/util/use-keydown";
import { useOnClickOutside } from "../../../Sameer/lib/util/use-on-click-outside";
import { SummaryVisualBoard } from "@/fabric/SummaryVisualBoard";
import "./SummaryReport.css";
import { CopyIcon } from "@/icons/Copy";
import { copyToClipboard } from "../../utils/utils";

export interface ViolationStudioProps {
  violations: any;
  totalCount: number;
  categoryNumber: number;
}

const ViolationStudio: React.FC<ViolationStudioProps> = ({
  violations,
  totalCount,
  categoryNumber,
}) => {
  const previewScrollRef = useRef<HTMLDivElement>(null);
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [selectedViolation, setSelectedViolation] = useState<number>(0);
  const closeMenu = () => {
    setShowDropDown(false);
  };
  useKeydown("Escape", closeMenu);
  const clickOutsideRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(clickOutsideRef, closeMenu);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div className="mb-2 flex w-1/2 items-center justify-start">
          <div className="mr-4 flex w-1/12 items-center justify-center bg-[#35ACEF] py-2 text-white">
            {categoryNumber}
          </div>
          <div className="flex w-6/12 items-center justify-center bg-[#35ACEF] py-2 text-white">
            {violations[selectedViolation].rule?.issueCategory}
          </div>
          {totalCount !== undefined && (
            <div className="mr-5 flex w-2/12 items-center justify-center bg-[#F86F80] p-2 text-white">
              {totalCount}
            </div>
          )}
        </div>
        <div className="hide-in-print  relative w-60" ref={clickOutsideRef}>
          <Button
            rounded={false}
            color="failure"
            onClick={() => {
              setShowDropDown(!showDropDown);
            }}
          >
            <HeadingTwo
              text={`sample violation ${selectedViolation + 1}`}
              className="pr-1"
            />
            <CircleDown stroke="white" />
          </Button>
          {showDropDown && (
            <ul className="absolute left-0 z-50 mt-1">
              {violations.map((_: any, index: number) => (
                <Button
                  key={index}
                  rounded={false}
                  color="tertiary"
                  className="my-1 w-56"
                  onClick={() => {
                    setSelectedViolation(index);
                    closeMenu();
                  }}
                >{`sample violation ${index + 1}`}</Button>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="mb-4 flex items-center border border-gray-300 bg-slate-50">
        <div className="flex items-center justify-start px-4">
          <div className="py-2 pr-2">
            <HeadingThree
              className="text-[#545454]"
              text={`Success Criteria: ${violations[selectedViolation].rule?.detailSuccessCriteria}`}
            />
          </div>

          {violations[selectedViolation].rule?.detailLevel && (
            <div className="flex items-center pl-2">
              <VerticalSeparator className="h-6 border-l border-black" />
              <HeadingThree
                className="pl-2 text-[#545454]"
                text={violations[selectedViolation].rule?.detailLevel}
              />
            </div>
          )}

          {violations[selectedViolation].rule?.id && (
            <div className="flex items-center px-2">
              <VerticalSeparator className="h-6 border-l border-black" />
              <HeadingThree
                className="pl-2 text-[#545454]"
                text={`Rule: ${violations[selectedViolation].rule?.id}`}
              />
            </div>
          )}
          {violations[selectedViolation].severity && (
            <div className="flex items-center pr-2">
              <VerticalSeparator className="h-6 border-l border-black" />
              <HeadingThree
                className="pl-2 text-[#545454]"
                text={violations[selectedViolation].severity}
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex w-full justify-between">
        <div className="w-5/12">
          <div className="bg-[#35ACEF] p-2">
            <HeadingTwo text="Preview" className="text-white" />
          </div>
          <div
            ref={previewScrollRef}
            className="mb-4 border border-gray-300 bg-slate-50"
          >
            <SummaryVisualBoard
              CanvasElement={ViolationPreview}
              elementProps={{
                validationObjs: [violations[selectedViolation]],
                scrollRef: previewScrollRef,
                automated: true,
              }}
            />
          </div>
          <div className="bg-[#35ACEF] p-2">
            <HeadingTwo text="Issue Description" className="text-white" />
          </div>
          <div className="border-x border-b	pb-4 pl-2">
            <HeadingThree
              text={violations[selectedViolation].successCriteriaDescription}
            />
          </div>
        </div>
        <div className="w-6/12">
          <div className="bg-[#35ACEF] p-2">
            <HeadingTwo text="Remediation Summary" className="text-white" />
          </div>

          <div className="border-x border-b p-2">
            <HeadingThree
              text={violations[selectedViolation].remediationSummary}
            />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <WarningIcon />
              <HeadingTwo text="Violation found at:" className="px-2" />
              <ExternalLink
                href={violations[selectedViolation].url}
                label={violations[selectedViolation].url}
                labelMaxCharacters={30}
                className="text-[#1174EA]"
              />
            </div>
          </div>
          <div className="flex items-center justify-start pt-2">
            <HeadingTwo text="Violation Id:" className="pr-2" />
            <ExternalLink
              title="violation id link"
              aria-label="violation id link"
              href={`/guided-validation/studio?appId=&scanId=&element=&stateId=&groupId=&id=${violations[selectedViolation].id}&isAutomated=true&url=`}
              label={violations[selectedViolation].id}
              labelMaxCharacters={80}
              className="text-[#1174EA]"
            />
          </div>

          {violations[selectedViolation].dupCount && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center justify-start">
                <div className="bg-[#35ACEF] p-2">
                  <HeadingTwo text="DUPLICATES FOUND" className="text-white" />
                </div>
                <div className="mr-2 bg-[#186E9E] p-2">
                  <HeadingTwo
                    text={violations[selectedViolation].dupCount}
                    className="text-white"
                  />
                </div>
                <HeadingThree
                  text="Multiple elements with the same violation found!"
                  className="text-[#003776]"
                />
              </div>
              {/* <Button className="border-none bg-[#35ACEF]">
                <HeadingTwo text="Fix All" className="text-white" />
              </Button> */}
            </div>
          )}
          <div className="mt-4">
            <div className="flex items-center justify-start">
              <HeadingTwo text="CSS SELECTOR" className="pr-2" />
              <div
                className="hide-in-print cursor-pointer"
                onClick={() => {
                  copyToClipboard(violations[selectedViolation].cssSelector);
                }}
              >
                <CopyIcon size={20} />
              </div>
            </div>
            <div className="border border-gray-300 bg-slate-50 p-4">
              <HeadingThree
                text={violations[selectedViolation].cssSelector}
                className="break-words text-xs"
              />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-start">
              <HeadingTwo text="HTML SOURCE" className="pr-2" />
              <div
                className="hide-in-print cursor-pointer"
                onClick={() => {
                  copyToClipboard(violations[selectedViolation].html);
                }}
              >
                <CopyIcon size={20} />
              </div>
            </div>

            <div className="overflow-clip border border-gray-300 bg-slate-50 p-4">
              <HeadingThree
                className="break-words text-xs"
                text={violations[selectedViolation].html}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViolationStudio;
