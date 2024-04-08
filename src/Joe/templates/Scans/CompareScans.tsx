import React from "react";
import { Box } from "@/atoms/Box";
import { Card } from "@/atoms/Card";
import { Text } from "@/atoms/Text";

export type CompareScansProps = {};

export const CompareScans: React.FC<CompareScansProps> = ({}) => {
  return (
    <Box>
      <Card
        flex
        variant="full-rounded"
        className="items-center justify-between bg-black/10 p-1"
      >
        <Text className="ml-8 text-4xl font-bold text-[#6A6A6A]">
          Compare scans
        </Text>
      </Card>
    </Box>
  );
};
