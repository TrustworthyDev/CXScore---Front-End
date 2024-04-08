import clsx from "clsx";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/atoms";
import { Box } from "@/atoms/Box";
import { Confirmation } from "@/atoms/Confirmation";
import { Text } from "@/atoms/Text";
import { CircleDown } from "@/icons/CircleDown";
import { CircleUp } from "@/icons/CircleUp";
import { ManualTestResult, ViolationType } from "@/types/enum";

import { TestResultAction } from "./TestResultAction";
import ValidationStudioContext from "./ValidationStudioContext";
import { HorizontalSeparator } from "../../../Sameer/components/atoms/seperator/horizontal-separator";

type ValidationRowProps = ListRowElementProps<IndexedValidation>;

export const ValidationRow: React.FC<ValidationRowProps> = ({
  row: { validation, index: validationInd },
}) => {
  const {
    activeItem: { activeValidation, activeRule },
    setActiveItem,
    currentTestResult,
    setCurrentTestResult,
    isFromViolations,
  } = useContext(ValidationStudioContext);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleClickRow = () => {
    setActiveItem &&
      setActiveItem({
        activeRule,
        activeValidation:
          activeValidation === validation.id ? "" : validation.id,
      });
    setCurrentTestResult?.(undefined);
  };

  const handleChangeTestResult = useCallback(
    (status: ManualTestResult) => {
      setCurrentTestResult?.(status);
    },
    [setCurrentTestResult],
  );

  const handleClickCancelModal = useCallback(
    (buttonId: string) => {
      setIsCancelModalOpen(false);
      if (buttonId === "yes") {
        navigate(isFromViolations ? "/violations" : "/guided-validation");
      }
    },
    [isFromViolations, navigate],
  );

  useEffect(() => {
    if (activeValidation === validation.id) {
      containerRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeValidation, validation.id]);

  if (activeValidation === validation.id) {
    return (
      <Box ref={containerRef} key={`validationRow-${validation.id}-active`}>
        <HorizontalSeparator />
        <Box className="mb-12">
          <Box flex className="items-center">
            <Box onClick={handleClickRow} className="cursor-pointer p-2">
              <CircleUp />
            </Box>
            <Box flex className="items-center">
              <Box>
                <Text className="inline font-bold text-black">Rule Name:</Text>
                <Text className="ml-1 inline text-black">
                  {validation.rule?.name}
                </Text>
              </Box>
              <Box
                flex
                className={clsx(
                  "ml-2 inline h-7 min-h-[1.75rem] w-7 min-w-[1.75rem] items-center justify-center rounded-full",
                  validation.rule?.type === ViolationType.automated
                    ? "bg-red-500"
                    : "bg-blue-500",
                )}
              >
                <Text variant="small">{validationInd + 1}</Text>
              </Box>
              <Text className="ml-1 inline font-bold text-red-600">{`[${validation.severity}]`}</Text>
            </Box>
          </Box>
          <TestResultAction
            validation={validation}
            currentTestResult={currentTestResult ?? validation.manualTestResult}
            isFromViolations={!!isFromViolations}
            onChangeTestResult={handleChangeTestResult}
          />
          <Box flex className="mt-8 items-center justify-center">
            <Button
              rounded
              className="bg-[#E26666] px-32"
              onClick={() => setIsCancelModalOpen(true)}
            >
              <Text>Cancel</Text>
            </Button>
          </Box>
        </Box>
        <HorizontalSeparator />

        <Confirmation
          isOpen={isCancelModalOpen}
          title="Cancel Changes"
          content="Would you like to discard and cancel all changes?"
          buttonList={[
            { buttonId: "yes", buttonText: "Yes", buttonStyle: "warning" },
            { buttonId: "no", buttonText: "No", buttonStyle: "success" },
          ]}
          onRequestClose={() => setIsCancelModalOpen(false)}
          onClickButton={handleClickCancelModal}
        />
      </Box>
    );
  }

  return (
    <Box
      flex
      className="ml-4 items-center"
      key={`validationRow-${validation.id}-noactive`}
      ref={containerRef}
    >
      <Box onClick={handleClickRow} className="cursor-pointer p-2">
        <CircleDown />
      </Box>
      <Box flex className="items-center">
        <Box>
          <Text className="inline font-bold text-black">Rule Name:</Text>
          <Text className="ml-1 inline text-black">
            {validation.rule?.name}
          </Text>
        </Box>
        <Box
          flex
          className={clsx(
            "ml-2 inline h-7 min-h-[1.75rem] w-7 min-w-[1.75rem] items-center justify-center rounded-full",
            validation.rule?.type === ViolationType.automated
              ? "bg-red-500"
              : "bg-blue-500",
          )}
        >
          <Text variant="small">{validationInd + 1}</Text>
        </Box>
        <Text className="ml-1 inline font-bold text-red-600">{`[${validation.severity}]`}</Text>
      </Box>
    </Box>
  );
};
