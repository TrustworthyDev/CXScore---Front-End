import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { getViolationDetail } from "@/api";
import { Box } from "@/atoms/Box";
import { Card } from "@/atoms/Card";
import { Text } from "@/atoms/Text";
import { VisualBoard } from "@/fabric/VisualBoard";
import { CXSFocusOrderDetailCanvas } from "@/templates/ViolationsDetail/DetailCanvas/CXSFocusOrder";
import { CXSKeyboardAccessibleDetailCanvas } from "@/templates/ViolationsDetail/DetailCanvas/CXSKeyboardAccessible";
import { CXSKeyboardTrapDetailCanvas } from "@/templates/ViolationsDetail/DetailCanvas/CXSKeyboardTrap";
import { CXSFocusOrderDetailComponent } from "@/templates/ViolationsDetail/DetailComponent/CXSFocusOrder";
import { CXSFocusVisibleDetailComponent } from "@/templates/ViolationsDetail/DetailComponent/CXSFocusVisible";
import { CXSKeyboardAccessibleDetailComponent } from "@/templates/ViolationsDetail/DetailComponent/CXSKeyboardAccessible";
import { CXSKeyboardTrapDetailComponent } from "@/templates/ViolationsDetail/DetailComponent/CXSKeyboardTrap";
import { ValidationAction } from "@/templates/ViolationsDetail/DetailComponent/ValidationAction";
import ViolationDetailContext from "@/templates/ViolationsDetail/ViolationDetailContext";
import { fetchImgWithAuthentication } from "@/utils";

import { HorizontalSeparator } from "../../../Sameer/components/atoms/seperator/horizontal-separator";
import { VerticalSeparator } from "../../../Sameer/components/atoms/seperator/vertical-separator";

export type ViolationDetailsPageProps = {
  className?: string;
};

type ViolationDetailParam = {
  violationID: string;
};

export const ViolationDetailsPage: React.FC<ViolationDetailsPageProps> = ({
  className,
}) => {
  const { violationID } = useParams<ViolationDetailParam>();
  const [violationDetail, setViolationDetail] = useState<ApiViolation>();
  const [snapshotImage, setSnapshotImage] = useState<string>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [queryParameters] = useSearchParams();
  const isFromViolation = queryParameters.get("isFromViolation") === "true";

  useEffect(() => {
    if (violationID) {
      getViolationDetail(violationID).then(setViolationDetail);
    }
  }, [violationID]);

  useEffect(() => {
    // const authToken =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhY2Nlc3Nib3QuaW8iLCJpYXQiOjE2NjUzNTUxOTF9.cFwegyUP8C6RCOVLw027Q3NMT_S-lRq2pv-GvkZhr9s";
    if (violationDetail) {
      const snapshotUrl = violationDetail.snapshotUrl;
      fetchImgWithAuthentication(
        snapshotUrl,
        // authToken
      ).then((base64Image) => {
        setSnapshotImage((img) => img ?? base64Image);
      });
    }
  }, [violationDetail]);

  const [ViolationDetailCanvas, ViolationDetailComp] = useMemo(() => {
    if (violationDetail && snapshotImage) {
      switch (violationDetail.ruleId) {
        case "CXS_Focus_Order":
        case "CXS_SR_Tab_Order":
        case "CXS_SR_Arrow_Order": {
          return [CXSFocusOrderDetailCanvas, CXSFocusOrderDetailComponent];
        }
        case "CXS_Keyboard_Trap": {
          return [CXSKeyboardTrapDetailCanvas, CXSKeyboardTrapDetailComponent];
        }
        case "CXS_Keyboard_Accessible":
        case "CXS_SR_Tab_Accessible":
        case "CXS_SR_Arrow_Accessible": {
          return [
            CXSKeyboardAccessibleDetailCanvas,
            CXSKeyboardAccessibleDetailComponent,
          ];
        }
        case "CXS_Focus_Visible": {
          return [null, CXSFocusVisibleDetailComponent];
        }
      }
    }
    return [null, () => <></>];
  }, [violationDetail, snapshotImage]);

  if (!violationDetail || !snapshotImage) {
    return <Box className={className}>Loading</Box>;
  }
  return (
    <ViolationDetailContext.Provider
      value={{
        activeIndex,
        setActiveIndex,
      }}
    >
      <Box flex flexDirection="col" className="h-full p-4">
        <Text variant="h1" className="text-black/90">
          {violationDetail.ruleId}
        </Text>
        {ViolationDetailCanvas ? (
          <Box flex className="mt-5 h-0 flex-grow">
            <Card className="flex flex-[2] flex-col">
              <Text variant="h2" className="mt-5 ml-5 text-black/70">
                Live Preview
              </Text>
              <Box ref={scrollRef} className="my-5 mx-5 h-full overflow-auto">
                <VisualBoard
                  CanvasElement={ViolationDetailCanvas}
                  elementProps={{
                    detailInfo: violationDetail.details,
                    snapshotImage,
                    scrollRef,
                  }}
                />
              </Box>
            </Card>
            <Box
              flex
              flexDirection="col"
              className="ml-2 mb-5 w-0 flex-1 overflow-auto"
            >
              <ViolationDetailComp
                detailInfo={violationDetail.details as any}
              />
              <HorizontalSeparator />
              <ValidationAction
                violation={violationDetail}
                isFromViolation={isFromViolation}
              />
            </Box>
          </Box>
        ) : (
          <Box flex>
            <ViolationDetailComp detailInfo={violationDetail.details as any} />
            <VerticalSeparator className="h-full" />
            <ValidationAction
              violation={violationDetail}
              isFromViolation={isFromViolation}
            />
          </Box>
        )}
      </Box>
    </ViolationDetailContext.Provider>
  );
};
