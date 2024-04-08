import { Box } from "@/atoms/Box";
import { Button } from "@/atoms/Button";
import { Text } from "@/atoms/Text";
import { Confirmation } from "@/atoms/Confirmation";
import { IssueStatus } from "@/molecules/IssueStatus/IssueStatus";
import { ManualTestResult } from "@/types/enum";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HorizontalSeparator } from "../../../../Sameer/components/atoms/seperator/horizontal-separator";
import {
  changeValidationStatus,
  confirmNotViolation,
  postCreateNewTicket,
} from "@/api";
import { TestResultAction } from "@/templates/ViolationStudio/TestResultAction";
import { CircleUp } from "@/icons/CircleUp";
import { toast } from "react-toastify";

type ValidationActionProps = {
  violation: ApiViolation;
  isFromViolation: boolean;
};

export const ValidationAction: React.FC<ValidationActionProps> = ({
  violation,
  isFromViolation,
}) => {
  const navigate = useNavigate();

  const [testResult, setTestResult] = useState<ManualTestResult>(
    ManualTestResult.pending
  );

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    switch (violation.manualTestResult) {
      case ManualTestResult.pending:
      case ManualTestResult.fail:
      case ManualTestResult.pass: {
        setTestResult(violation.manualTestResult);
        break;
      }
      default:
        setTestResult(ManualTestResult.pending);
    }
  }, [violation, isFromViolation]);

  const handleChangeTestResult = (status: ManualTestResult) => {
    setTestResult(status);
  };
  const handleClickCancelModal = useCallback(
    (buttonId: string) => {
      setIsCancelModalOpen(false);
      if (buttonId === "yes") {
        navigate(isFromViolation ? "/violations" : "/guided-validation");
      }
    },
    [isFromViolation]
  );

  const handleClickTicketModal = useCallback(
    async (buttonId: string) => {
      isFromViolation
        ? testResult === ManualTestResult.pass &&
          confirmNotViolation(violation.id)
        : changeValidationStatus(violation.id, testResult);
      switch (buttonId) {
        case "createSingleTicket": {
          await postCreateNewTicket({
            violationIds: [violation.id],
            createIndividualJiraTicket: true,
          });
          toast("Successfully created a ticket in JIRA for violation");
          break;
        }
        case "createMasterTicket": {
          await postCreateNewTicket({ violationIds: [violation.id] });
          toast(
            "Successfully created a Master ticket in JIRA for the duplicate elements"
          );
          break;
        }
      }
      if (isTicketModalOpen) {
        toast("Changes Saved");
      }

      setIsTicketModalOpen(false);
      navigate(isFromViolation ? "/violations" : "/guided-validation");
    },
    [testResult, isFromViolation]
  );
  const handleClickSubmit = useCallback(async () => {
    setIsSubmitting(false);
    try {
      if (testResult === ManualTestResult.pass && isFromViolation === true) {
        await handleClickTicketModal("");
        toast("Marked as Not a violation");
      } else {
        setIsTicketModalOpen(true);
      }
    } finally {
      setIsSubmitting(true);
    }
  }, [testResult, isFromViolation, handleClickTicketModal]);

  return (
    <Box className="flex-1">
      <Box>
        <Box flex className="ml-6 items-center">
          <Box>
            <Text variant="h3" className="inline font-bold text-black">
              Success Criteria:
            </Text>
            <Text variant="h3" className="ml-1 inline text-black">
              {violation.rule?.detailSuccessCriteria}
            </Text>
          </Box>
          <Text
            variant="h3"
            className="ml-1 inline font-bold text-red-600"
          >{`[${violation.severity}]`}</Text>
        </Box>

        <Box flex className="items-center">
          <Box className="cursor-pointer p-4">
            <CircleUp />
          </Box>
          <Box flex className="items-center">
            <Box>
              <Text className="inline font-bold text-black">Rule Name:</Text>
              <Text className="ml-1 inline text-black">
                {violation.rule?.name}
              </Text>
            </Box>
            <Text className="ml-1 inline font-bold text-red-600">{`[${violation.severity}]`}</Text>
          </Box>
        </Box>
        <TestResultAction
          validation={violation}
          currentTestResult={testResult}
          onChangeTestResult={handleChangeTestResult}
          isFromViolations={isFromViolation}
          defaultShowDetail={true}
        />
        <Box flex className="mt-8 items-center justify-center gap-10">
          <Button
            rounded
            className="w-40 bg-[#4EBCFA]"
            onClick={handleClickSubmit}
            loading={isSubmitting}
          >
            <Text>Submit & Next</Text>
          </Button>
          <Button
            rounded
            className="w-40 bg-[#E26666]"
            onClick={() => setIsCancelModalOpen(true)}
          >
            <Text>Cancel</Text>
          </Button>
        </Box>
      </Box>
      <Confirmation
        isOpen={isCancelModalOpen}
        title="Cancel Changes"
        content="Would you like to discard this change?"
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
        onRequestClose={() => {
          setIsTicketModalOpen(false);
          setIsSubmitting(false);
        }}
        onClickButton={handleClickTicketModal}
      />
    </Box>
  );
};
