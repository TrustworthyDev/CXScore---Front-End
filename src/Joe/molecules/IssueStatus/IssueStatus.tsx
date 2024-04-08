import React from "react";
import { Box, BoxProps } from "@/atoms/Box";
import { Text } from "@/atoms/Text";
import clsx from "clsx";
import { Exclamation } from "@/icons/Exclamation";
import { Close } from "@/icons/Close";
import { Pass } from "@/icons/Pass";
import { ManualTestResult } from "@/types/enum";

export type IssueStatusProps = {
  status: ManualTestResult;
  disabled?: boolean;
} & BoxProps;

const statusText = {
  [ManualTestResult.pass]: "Pass",
  [ManualTestResult.fail]: "Fail",
  [ManualTestResult.pending]: "Pending",
};
const statusConfig = {
  [ManualTestResult.pass]: {
    boxGradient: "from-[#2A67C4]/[0.14] to-[#1B0053]/[0.14]",
    text: "bg-[#4EBCFA]",
  },
  [ManualTestResult.fail]: {
    boxGradient: "from-[#C42A2A]/[0.14] to-[#1B0053]/[0.14]",
    text: "bg-[#FF6A3A]",
  },
  [ManualTestResult.pending]: {
    boxGradient: "from-[#C4A22A]/[0.14] to-[#533700]/[0.14]",
    text: "bg-[#FDD05E] text-black",
  },
};

export const IssueStatus: React.FC<IssueStatusProps> = ({
  status,
  disabled = false,
  className,
  ...containerProps
}) => {
  return (
    <Box
      flex
      flexDirection="col"
      className={clsx("items-center", className)}
      {...containerProps}
    >
      <Box
        flex
        className={clsx(
          "h-7 w-8 items-center justify-center rounded-[5px] bg-gradient-to-br",
          statusConfig[status].boxGradient
        )}
      >
        {status === ManualTestResult.pass && (
          <Pass fill={disabled ? "#C0C0C0" : undefined} />
        )}
        {status === ManualTestResult.fail && (
          <Close fill={disabled ? "#C0C0C0" : undefined} />
        )}
        {status === ManualTestResult.pending && (
          <Exclamation fill={disabled ? "#C0C0C0" : undefined} />
        )}
      </Box>
      <Text
        uppercase
        variant="small"
        className={clsx(
          "mt-3 w-[90px] py-1 text-center font-bold",
          statusConfig[status].text,
          disabled && "bg-[#ACACAC]"
        )}
      >
        {statusText[status]}
      </Text>
    </Box>
  );
};
