import React, { PropsWithChildren } from "react";
import { Box } from "@/atoms/Box";
import { ValidationStudioPage } from "@/pages/GuidedValidation";
import { Navigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import { UnderConstruction } from "../../../Sameer/components/page/common/under-construction";
import { useSelector } from "react-redux";
import { selectApplicationInfo } from "@/reduxStore/app/app.reducer";
import NextGuidedViolation from "../../../Sameer/routes/guided";
import { HeaderBar } from "../../../Sameer/components/page/common/header-bar";

export type GuidedValidationProps = {};

const GuidedValidationCommonLayout = (props: PropsWithChildren) => {
  return (
    <Box flex flexDirection="col" className="h-full py-5 pl-9 pr-14">
      <Box className="mb-3">
        <HeaderBar />
      </Box>
      {props.children}
    </Box>
  );
};

export const GuidedValidation: React.FC<GuidedValidationProps> = () => {
  const selectedAppId = useSelector(selectApplicationInfo)?.appId;
  return (
    <>
      {selectedAppId && (
        <Routes>
          <Route
            path="studio"
            element={
              <GuidedValidationCommonLayout>
                <ValidationStudioPage />
              </GuidedValidationCommonLayout>
            }
          />
          <Route
            path="replay/:objectID"
            element={
              <GuidedValidationCommonLayout>
                <UnderConstruction />
              </GuidedValidationCommonLayout>
            }
          />
          {/* <Route path="" element={<GuidedValidationPage />} /> */}
          <Route path="" element={<NextGuidedViolation />} />
          <Route path="*" element={<Navigate to="/guided-validation" />} />
        </Routes>
      )}
    </>
  );
};
