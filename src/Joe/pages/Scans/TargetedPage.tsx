import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { getScanStatus, submitScanRequest } from "@/api";
import { Box } from "@/atoms/Box";
import { Button } from "@/atoms/Button";
import { Image } from "@/atoms/Image";
import { Progressbar } from "@/atoms/Progressbar";
import { Spinner } from "@/atoms/Spinner";
import { Text } from "@/atoms/Text";
import { PageHeader } from "@/molecules/PageHeader";
import { selectApplicationInfo } from "@/reduxStore/app/app.reducer";
import { ScanStatus, ScanType } from "@/types/enum";
import images from "~/assets";

import { DebouncedSearchInput } from "../../../Sameer/components/page/common/debounced-search-input";
export type TargetedPageProps = {};

export const TargetedPage: React.FC<TargetedPageProps> = () => {
  const selectedApp = useSelector(selectApplicationInfo);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scanId, setScanId] = useState<string>();
  const [curStatus, setCurStatus] = useState<ApiScan>();
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleScan = useCallback(
    async (scanUrls: string[]) => {
      if (!selectedApp || scanUrls.length === 0) {
        return;
      }
      setIsSubmitting(true);
      setScanId(undefined);
      setCurStatus(undefined);
      try {
        const { scanId } = await submitScanRequest({
          url: scanUrls[0],
          scanType:
            scanUrls.length > 0
              ? ScanType.MultiPageScan
              : ScanType.SinglePageScan,
          scanUrlList: scanUrls,
          appId: {
            id: selectedApp.appId,
            name: selectedApp.appName,
          },
        });
        setScanId(scanId);
        fetchCurStatus();
      } catch (err) {
        console.log(err);
      }
      setIsSubmitting(false);
    },
    [selectedApp],
  );
  const handleClickSingleScan = useCallback(
    (scanUrl: string) => {
      if (scanUrl) {
        handleScan([scanUrl]);
      }
    },
    [handleScan],
  );

  const handleClickUpload = () => {
    inputFileRef.current?.click();
  };

  const handleChangeUploadFile = () => {
    if (!inputFileRef.current || !inputFileRef.current.files?.length) {
      return;
    }
    const siteFile = inputFileRef.current.files[0];
    const textType = /text.*/;
    const reader = new FileReader();
    if (siteFile.type.match(textType)) {
      reader.onload = () => {
        const content = reader.result as string;
        handleScan(
          content
            .replaceAll("\r", "")
            .trim()
            .split("\n")
            .filter((url) => url.length > 0),
        );
      };
      reader.readAsText(siteFile);
    }
  };

  const fetchCurStatus = async () => {
    if (!scanId) {
      return;
    }
    const status = await getScanStatus(scanId);
    console.log("Hello", status.status, status.maxSteps, status.currentStep);
    setCurStatus(status);
  };

  useEffect(() => {
    if (!scanId) {
      return;
    }
    const timeId = setInterval(fetchCurStatus, 500);
    return () => clearInterval(timeId);
  }, [scanId]);

  return (
    <Box>
      <PageHeader title="Initiate New Scan" className="mt-8" />
      <Box flex flexDirection="col" className="relative items-center">
        <DebouncedSearchInput
          placeholder="Enter URL/ Upload Sitemap.XML/CSV/Txt File"
          className="mt-28 min-h-[3.5rem] min-w-[54rem] flex-1"
          onClickSearch={handleClickSingleScan}
          disabled={isSubmitting}
        />
        <input
          type="file"
          id="file"
          accept=".txt, .xml"
          ref={inputFileRef}
          style={{ display: "none" }}
          onChange={handleChangeUploadFile}
        />
        <Button
          className="mt-12 bg-blue-500 px-20 py-2"
          onClick={handleClickUpload}
        >
          <Text variant="h3">UPLOAD</Text>
        </Button>
        <Box
          flex
          className="absolute -z-50 h-full w-full items-start justify-center opacity-60"
        >
          <Image
            src={images.datascanImg}
            className="h-auto w-1/3 mix-blend-multiply"
          />
        </Box>
        {isSubmitting && (
          <Box
            flex
            className="absolute z-50 h-full w-full items-center justify-center bg-white opacity-60"
          >
            <Spinner className="h-20 w-20 " />
          </Box>
        )}
        {scanId && (
          <>
            <Text variant="h3" className="mt-8 text-black">
              {curStatus
                ? curStatus.status !== ScanStatus.Queued
                  ? curStatus.status === ScanStatus.Done
                    ? "Done"
                    : `Running ${curStatus.currentStep} / ${curStatus.maxSteps}`
                  : "Queued"
                : ""}
            </Text>
            <Box className="mt-2 w-full px-20">
              <Progressbar
                value={
                  curStatus
                    ? curStatus.status !== ScanStatus.Queued
                      ? curStatus.status === ScanStatus.Done
                        ? 1
                        : (curStatus.currentStep - 1) / curStatus.maxSteps
                      : 0
                    : 0
                }
                className="h-4"
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};
