import React, { useCallback, useState } from "react";
import { Box } from "@/atoms/Box";
import { Text } from "@/atoms/Text";
import { Card } from "@/atoms/Card";
import { Button } from "@/atoms/Button";
import { FormInput } from "@/atoms/FormInput";
import { Link, useNavigate } from "react-router-dom";
import { submitScanRequest } from "@/api";
import { IndeterminateCheckbox } from "../../../Sameer/components/atoms/input/indeterminate-checkbox";
import { ScanType } from "@/types/enum";

export type SubmitPageProps = {};

export const SubmitPage: React.FC<SubmitPageProps> = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [formVals, setFormVals] = useState({
    scanUrl: "",
    appName: "",
    lob: "",
    email: "",
    checkedAgree: false,
  });
  const handleChangeFormVals = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.id === "checkedAgree") {
        setFormVals((vals) => ({ ...vals, [e.target.id]: !vals.checkedAgree }));
        return;
      }
      setFormVals((vals) => ({
        ...vals,
        [e.target.id]: e.target.value,
      }));
    },
    []
  );

  const isValidFormVals = useCallback(
    (vals: any) => {
      const { scanUrl, appName, lob, email, checkedAgree } = formVals;
      let isValid = true;
      if (scanUrl.length === 0) {
        isValid = false;
      }
      if (appName.length === 0) {
        isValid = false;
      }
      if (lob.length === 0) {
        isValid = false;
      }
      if (email.length === 0) {
        isValid = false;
      }
      if (!checkedAgree) {
        isValid = false;
      }
      return isValid;
    },
    [formVals]
  );

  const handleSubmitRequest = useCallback(async () => {
    setIsSubmitting(true);
    if (isValidFormVals(formVals)) {
      try {
        await submitScanRequest({
          url: formVals.scanUrl,
          scanType: ScanType.FullPageScan,
          scanUrlList: [],
          appId: {
            id: formVals.lob,
            name: formVals.appName,
          },
        });
        navigate("/scans/submit-result", {
          state: formVals,
        });
      } catch {}
    }
    setIsSubmitting(false);
  }, [formVals, isValidFormVals]);

  return (
    <Box className="mt-8">
      <Text className="mb-8 text-5xl text-black">Welcome Giri,</Text>
      <Card variant="full-rounded" className="bg-[#F5FAFF] p-7">
        <Text variant="h2" className="text-[#696969]">
          New Full Scan Request
        </Text>
        <Text className="text-black">
          Fill out the form and we will walk you through the result
        </Text>
      </Card>
      <Card variant="full-rounded" className="mt-5 bg-[#F3F6F8] py-7">
        <Box className="px-4">
          <Text className="text-black">{"* Mandatory Fields"}</Text>
        </Box>
        <Box className="w-full px-8">
          <FormInput
            mandatory={true}
            id="scanUrl"
            label="URL to scan"
            className="py-2.5"
            value={formVals.scanUrl}
            onChange={handleChangeFormVals}
          />
          <FormInput
            id="appName"
            mandatory={true}
            label="App Name"
            className="py-2.5"
            value={formVals.appName}
            onChange={handleChangeFormVals}
          />
          <FormInput
            id="lob"
            mandatory={true}
            label="LOB"
            className="py-2.5"
            value={formVals.lob}
            onChange={handleChangeFormVals}
          />
          <FormInput
            id="email"
            mandatory={true}
            label="Company Email"
            className="py-2.5"
            value={formVals.email}
            onChange={handleChangeFormVals}
          />
          <Box flex className="items-center justify-center">
            <IndeterminateCheckbox
              id="checkedAgree"
              checked={formVals.checkedAgree}
              onChange={handleChangeFormVals}
            />
            <Text className="ml-2 text-black">I agree to the </Text>
            <Link to="" className="mx-1 text-[#2FA9FF] underline">
              Terms of Service
            </Link>
            <Text className="text-black"> and </Text>
            <Link to="" className="mx-1 text-[#2FA9FF] underline">
              Privacy Policy
            </Link>
            <Text className="text-black">.</Text>
          </Box>
          <Box flex className="items-center justify-center">
            <Button
              className="w-[64rem] bg-[#6BBDDC] py-5"
              loading={isSubmitting}
              onClick={handleSubmitRequest}
            >
              <Text uppercase variant="h3">
                Submit New Scan Request
              </Text>
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};
