import React, { useCallback, useState, useEffect } from "react";
import { Box } from "@/atoms/Box";
import { Card } from "@/atoms/Card";
import { Text } from "@/atoms/Text";
import clsx from "clsx";
import { Left } from "@/icons/Left";
import { Button } from "@/atoms/Button";
import { CircleDown } from "@/icons/CircleDown";
import { CircleUp } from "@/icons/CircleUp";
import { SplitButton } from "@/molecules/SplitButton";
import { useNavigate } from "react-router-dom";
import { fetchImgWithAuthentication } from "@/utils";

export type ValidationProps = {
  title: string;
  violationObj: ApiViolation;
  className?: string;
  defaultActive?: boolean;
};

export const Validation: React.FC<ValidationProps> = ({
  title,
  violationObj,
  className,
  defaultActive = false,
}) => {
  const [isActive, setIsActive] = useState(defaultActive);
  const [base64Img, setBase64Img] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const authToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhY2Nlc3Nib3QuaW8iLCJpYXQiOjE2NjUzNTUxOTF9.cFwegyUP8C6RCOVLw027Q3NMT_S-lRq2pv-GvkZhr9s";

    fetchImgWithAuthentication(
      /*violationObj.snapshotUrl*/ "https://api-test.twinex.io/34070392-8e21-4039-a1eb-045ece54950f/7af8f335-147c-4d9c-94ca-d58d5c196cde-axe.png"
      // authToken
    ).then(setBase64Img);
  }, []);

  const handleClickBackToTable = useCallback(() => {
    navigate("/guided-validation", {
      state: { objectId: "123", criteriaId: "123" },
    });
  }, [navigate]);
  return (
    <Box className={clsx(className)}>
      <Card
        variant="half-rounded"
        className="mt-4 flex flex-row justify-between bg-[#FCFCFC] px-5 py-4"
      >
        <Box
          flex
          className="cursor-pointer items-center"
          onClick={() => setIsActive((a) => !a)}
        >
          <Text variant="h3" className="mr-3 text-black">
            {title}
          </Text>
          {isActive ? <CircleUp /> : <CircleDown />}
        </Box>
        <Text variant="h3" className="text-black">
          Video: What's New
        </Text>
      </Card>
      <Box
        className={clsx(
          "origin-top-left transition-all duration-200",
          isActive ? "scale-y-100 opacity-100" : "h-0 scale-y-0 opacity-0"
        )}
      >
        <Box flex className="mt-4">
          <Card className="flex flex-1 flex-col">
            <Text variant="h2" className="mt-5 ml-5 text-black/70">
              Live Preview
            </Text>
            <Box className="my-5 h-0 w-full flex-grow overflow-auto p-9">
              <img
                src={`data:image/png;base64,${base64Img}`}
                className="h-auto max-w-full"
                alt="Snapshot Image"
              />
            </Box>
          </Card>
          <Box className="ml-2 flex-1">
            <Text variant="h2" className="m-6 mb-4 text-black/70">
              Context
            </Text>
            <Box className="h-0 border border-black/30" />
            <Box className="py-6 pl-4">
              <Box flex className="ml-0.5 mb-5 items-start">
                <Box
                  flex
                  className="h-[30px] min-h-[30px] w-[30px] min-w-[30px] items-center justify-center rounded-full bg-success"
                >
                  <Text variant="h3">1</Text>
                </Box>
                <Box className="ml-6">
                  <Text variant="h3" className="mb-0.5 text-black/75">
                    {`Success Criteria: ${violationObj.rule?.detailSuccessCriteria}`}
                  </Text>
                  <Text className="mt-3 text-black/75">
                    {violationObj.remediationSummary}
                  </Text>
                </Box>
              </Box>
              <Box flex className="ml-0.5">
                <Box
                  flex
                  className="h-[30px] min-h-[30px] w-[30px] min-w-[30px] items-center justify-center rounded-full bg-success"
                >
                  <Text variant="h3">2</Text>
                </Box>
                <Box className="ml-6">
                  <Text variant="h3" className="mb-0.5 text-black/75">
                    {`Rule Name: ${violationObj.rule?.name}`}
                  </Text>
                  <Text className="mt-3 text-black/75">
                    {violationObj.rule?.description}
                  </Text>
                </Box>
              </Box>
            </Box>
            <Box className="h-0 border border-black/30" />
            <Box className="mx-6 py-4">
              <Text variant="h2" className="mb-4 text-black/75">
                How To Test
              </Text>
              <Text variant="body" className="text-black/75">
                {violationObj.rule?.help}
              </Text>
            </Box>
            <Box className="h-0 border border-black/30" />
            <Box flex className="mx-6 items-center justify-between py-8">
              <Text variant="h2" className="text-black/70">
                Result
              </Text>
              <Box
                flex
                className="cursor-pointer items-center transition-all active:opacity-80"
                onClick={handleClickBackToTable}
              >
                <Box className="rounded-full bg-success p-1">
                  <Left />
                </Box>
                <Text variant="h3" className="ml-2 text-black/70">
                  Back to Guided Validation Table
                </Text>
              </Box>
            </Box>
            <Box flex className="mx-6 items-center justify-around">
              <Button color="success" className="py-5 px-[60px]">
                <Text uppercase className="font-bold">
                  pass
                </Text>
              </Button>
              {/* <SplitButton
                listText="pass and create jira"
                onClickList={() => {}}
                buttonStyle="py-5 px-[60px]"
              >
                <Text uppercase className="font-bold">
                  pass
                </Text>
              </SplitButton> */}
              <Button
                color={"success" /*error */}
                className="bg-[#F26A6A] py-5 px-[60px]"
              >
                <Text uppercase className="font-bold">
                  fail
                </Text>
              </Button>
            </Box>
          </Box>
        </Box>
        {/* <Card variant="half-rounded" className="mt-4 bg-black/5 px-5 py-4">
          <Text variant="h3" className="text-black">
            Other Success Criteria Violations for same media type
          </Text>
        </Card> */}
      </Box>
    </Box>
  );
};
