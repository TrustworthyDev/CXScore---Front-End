import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

import { Box } from "@/atoms/Box";
import { Button } from "@/atoms/Button";
import { CheckBox } from "@/atoms/CheckBox";
import { Text } from "@/atoms/Text";
import { IssueStatus } from "@/molecules/IssueStatus/IssueStatus";
import { ManualTestResult } from "@/types/enum";
import { ViolationDetail } from "~/Sameer/components/page/violations/violation-filter-table-sub-component";

type Props = {
  isFromViolations: boolean;
  validation: ApiViolation;
  currentTestResult: ManualTestResult;
  onChangeTestResult: (status: ManualTestResult) => void;
  defaultShowDetail?: boolean;
};

export const TestResultAction: React.FC<Props> = ({
  validation,
  currentTestResult,
  isFromViolations,
  onChangeTestResult,
  defaultShowDetail,
}) => {
  const [isShowDetail, setIsShowDetail] = useState(!!defaultShowDetail);
  const handleClickShowDetail = useCallback(() => {
    setIsShowDetail((val) => !val);
  }, []);

  const handleChangeTestResult = (status: ManualTestResult) => {
    currentTestResult !== status && onChangeTestResult(status);
  };

  const handleClickNotAViolation = useCallback(
    () => onChangeTestResult(ManualTestResult.pass),
    [onChangeTestResult],
  );
  const handleClickConfirmAViolation = useCallback(
    () => onChangeTestResult(ManualTestResult.fail),
    [onChangeTestResult],
  );
  return (
    <Box>
      <Box className="ml-14">
        <Text className="mt-4 text-black">{validation.rule?.description}</Text>
        <Box className="my-3 grid w-fit grid-cols-2 gap-x-2 gap-y-1 px-2">
          <Text className="mr-4 font-bold text-black">Issue Category:</Text>
          <Text className="text-black">{validation.rule?.issueCategory}</Text>
          <Text className="mr-4 font-bold text-black">Url:</Text>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            to={validation.url || ""}
          >
            <Text className="break-all text-sky-500 underline">
              {validation.url}
            </Text>
          </Link>
        </Box>
        <Box flex className="mt-6 items-center">
          <Box className="mr-4">
            <Text variant="h2" className="font-semibold text-black">
              How To Test
            </Text>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              to={validation.rule?.helpUrl || ""}
            >
              <Text className="text-sky-500 underline">HELP URL</Text>
            </Link>
          </Box>
          <Button rounded onClick={handleClickShowDetail}>
            <Text uppercase>
              {isShowDetail ? "Hide Detail" : "Show Detail"}
            </Text>
          </Button>
        </Box>
      </Box>
      {isShowDetail && <ViolationDetail violation={validation} vertical />}
      <Box flex className="mt-10 items-center justify-around">
        {isFromViolations ? (
          <>
            <Box
              flex
              className="cursor-pointer gap-2"
              onClick={handleClickNotAViolation}
            >
              <CheckBox checked={currentTestResult === ManualTestResult.pass} />
              <Text variant="h3" className="text-black">
                Pass
              </Text>
            </Box>
            <Box
              flex
              className="cursor-pointer gap-2"
              onClick={handleClickConfirmAViolation}
            >
              <CheckBox checked={currentTestResult === ManualTestResult.fail} />
              <Text variant="h3" className="text-black">
                Fail
              </Text>
            </Box>
          </>
        ) : (
          <>
            <IssueStatus
              status={ManualTestResult.pass}
              disabled={currentTestResult !== ManualTestResult.pass}
              className="cursor-pointer"
              onClick={() => handleChangeTestResult(ManualTestResult.pass)}
            />
            <IssueStatus
              status={ManualTestResult.fail}
              disabled={currentTestResult !== ManualTestResult.fail}
              className="cursor-pointer"
              onClick={() => handleChangeTestResult(ManualTestResult.fail)}
            />
            <IssueStatus
              status={ManualTestResult.pending}
              disabled={currentTestResult !== ManualTestResult.pending}
              className="cursor-pointer"
              onClick={() => handleChangeTestResult(ManualTestResult.pending)}
            />
          </>
        )}
      </Box>
    </Box>
  );
};
