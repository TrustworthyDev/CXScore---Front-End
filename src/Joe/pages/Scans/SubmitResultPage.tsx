import React from "react";
import { useLocation } from "react-router-dom";

import { Box } from "@/atoms/Box";
import { Card } from "@/atoms/Card";
import { Image } from "@/atoms/Image";
import { Text } from "@/atoms/Text";
import { PageHeader } from "@/molecules/PageHeader";
import images from "~/assets";

export type SubmitResultPageProps = {};

export const SubmitResultPage: React.FC<SubmitResultPageProps> = () => {
  const location = useLocation();
  return (
    <Box>
      <PageHeader title="Scan Request Submitted" />
      <Box flex className="mt-6 items-end">
        <Card variant="half-rounded" className="h-[32rem] bg-[#ECECEC] p-10">
          <Image
            src={images.logoGif}
            className="h-auto w-[25rem] mix-blend-darken"
          />
          <Box flex>
            <Text className="mr-1 text-black">URL to scan: </Text>
            <Text className="font-bold text-black">
              {location.state?.scanUrl ?? ""}
            </Text>
          </Box>
          <Box flex>
            <Text className="mr-1 text-black">App Name: </Text>
            <Text className="font-bold text-black">
              {location.state?.appName ?? ""}
            </Text>
          </Box>
          <Box flex>
            <Text className="mr-1 text-black">LOB</Text>
            <Text className="font-bold text-black">
              {location.state?.lob ?? ""}
            </Text>
          </Box>
          <Box flex>
            <Text className="mr-1 text-black">Scan initiated by</Text>
            <Text className="font-bold text-black">
              {location.state?.email ?? ""}
            </Text>
          </Box>
        </Card>
        <Box flex flexDirection="col" className="flex-1 items-center">
          <Text variant="h1" className="text-[#606060]">
            Thanks for submitting your scan request!
          </Text>
          <Text variant="h3" className="text-black">
            You will be notified via email once scan is completed
          </Text>
          <Image
            src={images.datascanImg}
            className="h-auto w-80 mix-blend-multiply"
          />
        </Box>
      </Box>
    </Box>
  );
};
