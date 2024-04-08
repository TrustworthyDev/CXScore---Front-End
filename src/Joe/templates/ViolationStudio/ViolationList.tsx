import React, { useCallback, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  changeValidationStatus,
  confirmNotViolation,
  postCreateNewTicket,
} from "@/api";
import { Button } from "@/atoms";
import { Box } from "@/atoms/Box";
import { Card } from "@/atoms/Card";
import { Confirmation } from "@/atoms/Confirmation";
import { List } from "@/atoms/List";
import { Text } from "@/atoms/Text";
import { ManualTestResult, ViolationType } from "@/types/enum";

import { ValidationRuleRow } from "./ValidationRuleRow";
import ValidationStudioContext from "./ValidationStudioContext";
import { Skeleton } from "../../../Sameer/components/atoms/loading/skeleton";
import { HorizontalSeparator } from "../../../Sameer/components/atoms/seperator/horizontal-separator";

type ValidationListProps = {
  validationObjs: ApiViolation[];
  showAutomated: boolean;
  showManual: boolean;
};

export const ValidationList: React.FC<ValidationListProps> = ({
  validationObjs,
  showAutomated,
  showManual,
}) => {
  const {
    activeItem: { activeValidation, activeRule },
    setActiveItem,
    isFromViolations,
    currentTestResult,
    setCurrentTestResult,
  } = useContext(ValidationStudioContext);
  const navigate = useNavigate();

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const finalCurrentTestResult = useMemo(() => {
    if (typeof currentTestResult !== "undefined") {
      return currentTestResult;
    }
    return (
      validationObjs.find((v) => v.id === activeValidation)?.manualTestResult ||
      ManualTestResult.fail
    );
  }, [validationObjs, activeValidation, currentTestResult]);

  const filteredValidationObjs = useMemo(
    () =>
      validationObjs.filter(
        (obj) =>
          (showAutomated && obj.rule?.type === ViolationType.automated) ||
          (showManual && obj.rule?.type === ViolationType.manual),
      ),
    [validationObjs, showAutomated, showManual],
  );

  const handleClickBegin = useCallback(() => {
    filteredValidationObjs.length > 0 &&
      setActiveItem?.({
        activeRule: filteredValidationObjs[0].ruleId,
        activeValidation: filteredValidationObjs[0].id,
      });
  }, [setActiveItem, filteredValidationObjs]);

  const handleClickCancelModal = useCallback(
    async (buttonId: string) => {
      setIsCancelModalOpen(false);
      if (buttonId === "yes") {
        navigate(isFromViolations ? "/violations" : "/guided-validation");
      }
    },
    [isFromViolations, navigate],
  );
  const validationsGroupedByRule = useMemo(
    () =>
      validationObjs
        .reduce<ValidationByRule[]>((res, obj, index) => {
          if (
            !(showAutomated && obj.rule?.type === ViolationType.automated) &&
            !(showManual && obj.rule?.type === ViolationType.manual)
          ) {
            return res;
          }
          const targetRulePool = res.find(
            (dataByRule) => dataByRule.ruleId === obj.ruleId,
          );
          if (targetRulePool) {
            targetRulePool.validations.push({ index, validation: obj });
            return res;
          } else {
            return [
              ...res,
              {
                ruleId: obj.ruleId,
                rule: obj.rule,
                validations: [{ index, validation: obj }],
              },
            ];
          }
        }, [])
        .sort((a, b) => (a.ruleId > b.ruleId ? 1 : -1)),
    [validationObjs, showAutomated, showManual],
  );

  // const validationDisplayOrder = useMemo(() => {

  // }, []);

  const handleClickTicketModal = useCallback(
    async (buttonId: string) => {
      if (!activeValidation) {
        return;
      }
      await (isFromViolations
        ? finalCurrentTestResult === ManualTestResult.pass &&
          confirmNotViolation(activeValidation)
        : changeValidationStatus(activeValidation, finalCurrentTestResult));
      switch (buttonId) {
        case "createSingleTicket": {
          await postCreateNewTicket({
            violationIds: [activeValidation],
            createIndividualJiraTicket: true,
          });
          toast("Successfully created a ticket in JIRA for violation");
          break;
        }
        case "createMasterTicket": {
          await postCreateNewTicket({ violationIds: [activeValidation] });
          toast(
            "Successfully created a Master ticket in JIRA for the duplicate elements",
          );
          break;
        }
      }
      if (isTicketModalOpen) {
        toast("Changes Saved");
      }
      setIsTicketModalOpen(false);

      const curInd = filteredValidationObjs.findIndex(
        (v) => v.id === activeValidation,
      );
      if (curInd === -1 || curInd === filteredValidationObjs.length - 1) {
        return;
      }
      filteredValidationObjs[curInd].manualTestResult = finalCurrentTestResult;
      const nextValidation = filteredValidationObjs[curInd + 1];
      setCurrentTestResult?.(undefined);
      setActiveItem?.({
        activeRule: nextValidation.ruleId,
        activeValidation: nextValidation.id,
      });
      //navigate(isFromViolations ? "/violations" : "/guided-validation");
    },
    [
      activeValidation,
      isFromViolations,
      finalCurrentTestResult,
      isTicketModalOpen,
      filteredValidationObjs,
      setCurrentTestResult,
      setActiveItem,
    ],
  );

  const handleClickSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      if (
        finalCurrentTestResult === ManualTestResult.pass &&
        isFromViolations === true
      ) {
        await handleClickTicketModal("");
        toast("Marked as Not a violation");
      } else {
        setIsTicketModalOpen(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [finalCurrentTestResult, isFromViolations, handleClickTicketModal]);

  const bottomComp = useMemo(() => {
    if (activeRule !== "" && activeValidation === "") {
      return (
        <Box flex flexDirection="col" className="mb-2 mt-9 w-full items-center">
          <Text variant="h1" className="font-bold text-[#5F5F5F]">
            Total Rule Validations for Success Criteria
          </Text>
          <Text className="text-[106px] font-extrabold leading-[unset] text-[#E26666]">
            {validationsGroupedByRule.find((rule) => rule.ruleId === activeRule)
              ?.validations.length || 0}
          </Text>
          <Text variant="h1" className="text-black">
            {`Let's get started`}
          </Text>
          <Button
            rounded
            className="mt-6 bg-[#6996ED] py-6 px-24"
            onClick={handleClickBegin}
          >
            <Text variant="h1">Begin Validation</Text>
          </Button>
        </Box>
      );
    } else if (activeRule !== "" && activeValidation !== "") {
      return (
        <Box flex className="mb-2 mt-9 w-full items-center justify-around">
          <Button
            rounded
            className="w-56 bg-[#4EBCFA]"
            onClick={handleClickSubmit}
            loading={isSubmitting}
          >
            <Text>{"SUBMIT & NEXT"}</Text>
          </Button>
          <Button
            rounded
            className="w-56 bg-[#E26666]"
            onClick={() => setIsCancelModalOpen(true)}
          >
            <Text>{"CANCEL"}</Text>
          </Button>
        </Box>
      );
    }
    return (
      <Box flex flexDirection="col" className="mb-2 mt-9 w-full items-center">
        <Text variant="h1" className="font-bold text-[#5F5F5F]">
          Total Validations on Page
        </Text>
        <Text className="text-[106px] font-extrabold leading-[unset] text-[#E26666]">
          {filteredValidationObjs.length}
        </Text>
        <Text variant="h1" className="text-black">
          {`Let's get started`}
        </Text>
        <Button
          rounded
          className="mt-6 bg-[#6996ED] py-6 px-24"
          onClick={handleClickBegin}
        >
          <Text variant="h1">Begin Validation</Text>
        </Button>
      </Box>
    );
  }, [
    activeRule,
    activeValidation,
    filteredValidationObjs.length,
    handleClickBegin,
    validationsGroupedByRule,
    handleClickSubmit,
    isSubmitting,
  ]);

  return (
    <Card roundedTR className="h-full bg-white/80 p-1">
      {validationObjs.length === 0 ? (
        <Box className="w-full space-y-2 py-8">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="!h-4 !w-full" />
          ))}
        </Box>
      ) : (
        <>
          <Box className="max-h-[600px] min-h-[400px] overflow-y-auto py-8">
            <List
              data={validationsGroupedByRule}
              RowElement={ValidationRuleRow}
            />
          </Box>
          <HorizontalSeparator />
          {bottomComp}
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
          <Confirmation
            isOpen={isTicketModalOpen}
            title="Create Service Ticket"
            content="Multiple Rules detected for the same page. Would you like to create a Master Ticket for the whole page?"
            buttonList={[
              {
                buttonId: "createMasterTicket",
                buttonText: "Create Master De-dupe Ticket",
                buttonStyle: "success",
              },
              {
                buttonId: "createSingleTicket",
                buttonText: "Create Single Ticket",
                buttonStyle: "success",
              },
              {
                buttonId: "noTicket",
                buttonText: "Submit without Ticket",
                buttonStyle: "warning",
              },
            ]}
            onRequestClose={() => setIsTicketModalOpen(false)}
            onClickButton={handleClickTicketModal}
          />
        </>
      )}
    </Card>
  );
};
