import React, { useCallback, useContext, useState } from "react";
import { Box } from "@/atoms/Box";
import { Image } from "@/atoms/Image";
import { Text } from "@/atoms/Text";
import clsx from "clsx";
import { Flex } from "@/atoms/Flex";

export type CXSFocusVisibleDetailComponentProps = {
  detailInfo: CXSFocusVisibleDetail;
};

export const CXSFocusVisibleDetailComponent: React.FC<
  CXSFocusVisibleDetailComponentProps
> = ({ detailInfo }) => {
  const [isShowDetail, setIsShowDetail] = useState(true);
  const handleClickShowDetail = useCallback(
    () => setIsShowDetail((s) => !s),
    []
  );
  return (
    <Box className="p-4">
      <Flex>
        <Text
          variant="h3"
          className="text-black"
        >{`${detailInfo.message}`}</Text>
        <Text
          variant="small"
          className="ml-2 cursor-pointer self-center text-cyan-600 hover:underline"
          onClick={handleClickShowDetail}
        >
          {isShowDetail ? "Hide Detail" : "Show Detail"}
        </Text>
      </Flex>
      {isShowDetail && (
        <Text className="ml-6 whitespace-pre-wrap text-black">
          {JSON.stringify(
            {
              minimalAreaViolation: detailInfo.minimalAreaViolation,
              contrastViolation: detailInfo.contrastViolation,
              pixelRatio: detailInfo.pixelRatio,
              colorContrast: detailInfo.colorContrast,
              backgroundColor: detailInfo.backgroundColor,
              indicatorColor: detailInfo.indicatorColor,
            },
            null,
            2
          )}
        </Text>
      )}
      <Box className="my-2">
        <Text variant="h2" className="text-gray-600">
          No focus Image
        </Text>
        <Image
          src={`data:image/png;base64,${detailInfo.noFocusImage}`}
          className="h-40 w-auto"
        />
      </Box>
      <Box className="my-2">
        <Text variant="h2" className="text-gray-600">
          Focus Image
        </Text>
        <Image
          src={`data:image/png;base64,${detailInfo.focusImage}`}
          className="h-40 w-auto"
        />
      </Box>
      <Box className="my-2">
        <Text variant="h2" className="text-gray-600">
          Dilated Image
        </Text>
        <Image
          src={`data:image/png;base64,${detailInfo.dilatedImage}`}
          className="h-40 w-auto"
        />
      </Box>
      <Box className="my-2">
        <Text variant="h2" className="text-gray-600">
          Masked Image
        </Text>
        <Image
          src={`data:image/png;base64,${detailInfo.maskedImage}`}
          className="h-40 w-auto"
        />
      </Box>
      <Box className="my-2">
        <Text variant="h2" className="text-gray-600">
          Difference
        </Text>
        <Image
          src={`data:image/png;base64,${detailInfo.diffImage}`}
          className="h-40 w-auto"
        />
      </Box>
    </Box>
  );
};
