import clsx from "clsx";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getViolationDetail } from "@/api";
import { Box } from "@/atoms/Box";
import { Text } from "@/atoms/Text";
import { Toggle } from "@/atoms/Toogle";
import { VisualBoard } from "@/fabric/VisualBoard";
import { CircleLeft } from "@/icons/CircleLeft";
import { CircleRight } from "@/icons/CircleRight";
import { PageHeader } from "@/molecules/PageHeader";
import { ValidationList, ViolationPreview } from "@/templates/ViolationStudio";
import ValidationStudioContext from "@/templates/ViolationStudio/ValidationStudioContext";
import { ManualTestResult } from "@/types/enum";

import { useQueryViolationArgsForGuided } from "../../../Sameer/lib/guided/query";
import {
  getQueryViolationFetchFn,
  useQueryViolationArgs,
} from "../../../Sameer/lib/violations/query";

export type ValidationStudioPageProps = {
  className?: string;
};

type ViolationsByState = {
  stateId: string;
  violations: ApiViolation[];
};

function groupByStateId(data: ApiViolation[]): ViolationsByState[] {
  return data.reduce<ViolationsByState[]>((res, val) => {
    const targetPool = res.find((s) => s.stateId === val.stateId);
    if (targetPool) {
      targetPool.violations.push(val);
    } else {
      res.push({ stateId: val.stateId, violations: [val] });
    }
    return res;
  }, []);
}

export const ValidationStudioPage: React.FC<ValidationStudioPageProps> = ({
  className,
}) => {
  const violationQueryArgs = useQueryViolationArgs({});

  const guidedQueryArgs = useQueryViolationArgsForGuided({});

  const [queryParameters] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [validationObjs, setValidationObjs] = useState<ViolationsByState[]>([]);
  const [currentInd, setCurrentInd] = useState(0);
  const [showAutomated, setShowAutomated] = useState(true);
  const [showManual, setShowManual] = useState(true);
  const previewScrollRef = useRef<HTMLDivElement>(null);
  const [activeItem, setActiveItem] = useState<ActiveItem>({
    activeRule: "",
    activeValidation: "",
  });
  const [currentTestResult, setCurrentTestResult] =
    useState<ManualTestResult>();

  const fetchValidationData = useCallback(async () => {
    const violationID = queryParameters.get("id");
    const encodedURI = queryParameters.get("url");
    const stateId = queryParameters.get("stateId");
    const encodedElement = queryParameters.get("element");
    const scanId = queryParameters.get("scanId");
    const groupId = queryParameters.get("groupId");
    // const appName = queryParameters.get("appName");
    const isAutomated = queryParameters.get("isAutomated");
    if (isAutomated === "true") {
      setShowAutomated(true);
      setShowManual(false);
    } else {
      setShowAutomated(true);
      setShowManual(true);
    }
    if (encodedURI || stateId || encodedElement || groupId) {
      const filterArgs = structuredClone(
        isAutomated == "true" ? violationQueryArgs : guidedQueryArgs,
      );
      filterArgs.fieldMatchQueryOpts.appId = undefined;
      filterArgs.fieldMatchQueryOpts.stateIds = [];
      if (!filterArgs.fieldMatchQueryOpts.overrideFieldMatchQuery) {
        filterArgs.fieldMatchQueryOpts.overrideFieldMatchQuery = [];
      }
      if (encodedURI) {
        const appUrl = decodeURIComponent(encodedURI);
        filterArgs.fieldMatchQueryOpts.overrideFieldMatchQuery.push({
          field: "url",
          value: appUrl,
        });
      } else if (stateId) {
        filterArgs.fieldMatchQueryOpts.stateIds = [stateId];
      } else if (groupId) {
        filterArgs.fieldMatchQueryOpts.overrideFieldMatchQuery.push({
          field: "groupId",
          value: groupId,
        });
      } else if (encodedElement) {
        const element = decodeURIComponent(encodedElement);
        filterArgs.fieldMatchQueryOpts.overrideFieldMatchQuery.push({
          field: "rule.issueClassification",
          value: element,
        });
      }

      filterArgs.fieldMatchQueryOpts.scanId = scanId ?? undefined;

      let violations: ApiViolation[] = [];
      if (isAutomated === "true") {
        filterArgs.fieldMatchQueryOpts.overrideFieldMatchQuery.push({
          field: "manualTestResult",
          value: ManualTestResult.fail,
        });
      } else {
        filterArgs.fieldMatchQueryOpts.overrideFieldMatchQuery.push({
          field: "type",
          value: "guided_test",
        });
      }
      violations = await getQueryViolationFetchFn(filterArgs)().then(
        (res) => res.result,
      );
      setValidationObjs(groupByStateId(violations));
      setActiveItem({ activeRule: "", activeValidation: "" });
    } else if (violationID) {
      const violationDetail = await getViolationDetail(violationID);
      setActiveItem({
        activeRule: violationDetail.ruleId,
        activeValidation: violationDetail.id,
      });
      setValidationObjs(groupByStateId([violationDetail]));
    } else {
      return;
    }
    setCurrentInd(0);
  }, [guidedQueryArgs, queryParameters, violationQueryArgs]);

  useEffect(() => {
    fetchValidationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeShowManual = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowManual(e.target.checked);
  };

  const handleChangeShowAutomated = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setShowAutomated(e.target.checked);
  };

  const handleChangeActiveItem = (item: ActiveItem) => {
    setActiveItem(item);
  };
  const handleChangeIndex = (delta: number) => {
    setCurrentInd((ind) => ind + delta);
    setLoading(true);
    setTimeout(() => setLoading(false), 400);
  };

  if (!validationObjs.length) {
    return <Box>loading...</Box>;
  }

  return (
    <ValidationStudioContext.Provider
      value={{
        activeItem,
        setActiveItem: handleChangeActiveItem,
        currentTestResult,
        setCurrentTestResult,
        isFromViolations: queryParameters.get("isAutomated") === "true",
      }}
    >
      <Box className={clsx("h-full", className)}>
        <PageHeader title="Guided Validation Studio" />
        <Box flex className="mt-4 mb-2 items-center space-x-2">
          <Text variant="h3" className="text-black">{`States ${
            currentInd + 1
          }/${validationObjs.length}`}</Text>
          <button
            disabled={currentInd === 0 || loading}
            onClick={() => handleChangeIndex(-1)}
          >
            <CircleLeft />
          </button>
          <button
            disabled={currentInd === validationObjs.length - 1 || loading}
            onClick={() => handleChangeIndex(1)}
          >
            <CircleRight />
          </button>
        </Box>
        {loading ? (
          <Box>loading...</Box>
        ) : (
          <Box flex className="">
            <Box flex flexDirection="col" className="flex-[3]">
              <Box flex className="items-center justify-between">
                <Text variant="h2" className="font-bold text-[#4F4F4F]">
                  Preview
                </Text>
                <Box flex className="items-center justify-end">
                  <Box flex className="items-center">
                    <Box className="mr-1.5 h-[1.125rem] w-[1.125rem] rounded-full bg-[#E26666]" />
                    <Text variant="h3" className="text-[#4F4F4F]">
                      Automated
                    </Text>
                    <Toggle
                      checked={showAutomated}
                      onChange={handleChangeShowAutomated}
                    />
                  </Box>
                  <Box flex className="ml-5 items-center">
                    <Box className="mr-1.5 h-[1.125rem] w-[1.125rem] rounded-full bg-[#6996ED]" />
                    <Text variant="h3" className="text-[#4F4F4F]">
                      Manual
                    </Text>
                    <Toggle
                      checked={showManual}
                      onChange={handleChangeShowManual}
                    />
                  </Box>
                  {/* <Box flex className="ml-5 items-center">
                  <Text variant="h3" className="text-[#4F4F4F]">
                    Show bounding box
                  </Text>
                  <Toggle variant="medium" />
                </Box> */}
                </Box>
              </Box>
              <Box className="relative my-5 mx-5 flex h-0 flex-grow">
                <Box
                  className="flex-1 overflow-auto border"
                  ref={previewScrollRef}
                >
                  <VisualBoard
                    CanvasElement={ViolationPreview}
                    elementProps={{
                      validationObjs: validationObjs[currentInd].violations,
                      scrollRef: previewScrollRef,
                      showManual,
                      showAutomated,
                    }}
                  />
                </Box>
              </Box>
            </Box>
            <Box className="flex-[2]">
              <ValidationList
                validationObjs={validationObjs[currentInd].violations}
                showManual={showManual}
                showAutomated={showAutomated}
              />
            </Box>
          </Box>
        )}
      </Box>
    </ValidationStudioContext.Provider>
  );
};
