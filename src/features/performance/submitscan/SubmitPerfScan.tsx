import {
  ActionIcon,
  Autocomplete,
  Box,
  Button,
  Group,
  Loader,
  Menu,
  Radio,
  Select,
  Stack,
  Title,
  rem,
} from "@mantine/core";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  cancelScanRequest,
  getAppsByUrl,
  getScanStatus,
  getUrlSuggestions,
  submitChromeRRScanRequest,
  submitScanRequest,
} from "@/api";
import { useScannedUrlData, useSequenceData } from "@/api/useRequest";
import { Flex } from "@/atoms/Flex";
import { Progressbar } from "@/atoms/Progressbar";
import { Text } from "@/atoms/Text";
import { TextInput } from "@/atoms/TextInput";
import { UploadInput } from "@/atoms/UploadInput";
import { CircleDown } from "@/icons/CircleDown";
import { onChangeApplication } from "@/reduxStore/app/app.actions";
import { ScanStatus, ScanSubType, ScanType } from "@/types/enum";
import { getFullUrl } from "@/utils/stringUtils";
import { AppSelectOrCreate } from "~/Joe/templates/Scans/AppSelectOrCreate";
import { ScanCard } from "~/Joe/templates/Scans/ScanCard";
import { useExportToCSV } from "~/Sameer/lib/util/use-export-to-csv";
import { useKeydown } from "~/Sameer/lib/util/use-keydown";
import { useOnClickOutside } from "~/Sameer/lib/util/use-on-click-outside";
import HeadingThree from "~/Suraj/component/common/headings/HeadingThree";
import HeadingTwo from "~/Suraj/component/common/headings/HeadingTwo";
import Toast from "~/Suraj/component/common/toasts/Toast";

import PerfScanSettings from "./PerfScanSettings";
import {
  CHROME_RR_JSON,
  TEXT,
  XML,
  extractUrlsFromJson,
  extractUrlsFromText,
  extractUrlsFromXml,
  getDomainFromUrl,
  isXmlOrTextFile,
  processTextFile,
  processXmlSitemapFile,
  readJsonFile,
  validateUrls,
} from "../../../Suraj/utils/sitemap/sitemap.utils";

type AppInfo = {
  appId: string;
  appName: string;
};

// type StaticUrlInfo = {
//   url: string;
//   source: string;
// };

type SitemapDownloadFile = {
  url: string | undefined;
  error?: string | undefined;
  source: string | undefined;
};

interface SubmitScanProps {}

export const SubmitPerfScan: React.FC<SubmitScanProps> = () => {
  const navigate = useNavigate();

  const { data: sequenceList } = useSequenceData();
  const [activeScan, setActiveScan] = useState<
    [ScanType | null, ScanSubType | null]
  >([null, null]);
  const [singleUrl, setSingleUrl] = useState("");
  const [singleUrlSuggestions, setSingleUrlSuggestions] = useState<string[]>(
    [],
  );
  const [loadingSingleUrlSuggestions, setLoadingSingleUrlSuggestions] =
    useState(false);
  const [scanUrls, setScanUrls] = useState<string[]>([]);
  const [inputFileUrls, setInputFileUrls] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [selectedApp, setSelectedApp] = useState<AppInfo>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scanId, setScanId] = useState<string>();
  const [curStatus, setCurStatus] = useState<ApiScan>();
  const [toastMessage, setToastMessage] = useState<ReactNode | undefined>(
    undefined,
  );
  const [toastId, setToastId] = useState<string | undefined>(undefined);
  const [scanName, setScanName] = useState<string>();
  const [, setShowScanAtomButtonDropdown] = useState<boolean>(true);
  const [selectedScanRadioAtomButton, setSelectedScanRadioAtomButton] =
    useState<string>("scanWithUrl");

  const closeMenu = () => {
    setShowScanAtomButtonDropdown(false);
  };
  useKeydown("Escape", closeMenu);
  const clickOutsideRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(clickOutsideRef, closeMenu);

  const dispatch = useDispatch();
  const scannedUrlListQuery = useScannedUrlData(selectedApp?.appId || "");
  const [uploadSitemapDownloadData, setUploadSitemapDownloadData] = useState<
    SitemapDownloadFile[]
  >([]);
  // const staticUrlListQuery = useStaticUrlListData(selectedApp?.appId || "");
  // const [staticUrlList, setStaticUrlList] = useState<StaticUrlInfo[]>(
  //   staticUrlListQuery?.data || []
  // );

  const [activeScanType, activeScanSubType] = activeScan;
  const [selectedEventSeqId, setSelectedEventSeqId] = useState("");

  const sequenceSelectData = useMemo(
    () =>
      sequenceList
        ? sequenceList
            .filter(({ name }) => !!name)
            .map(({ id, name }) => ({
              value: id,
              label: name,
            }))
        : [],
    [sequenceList],
  );

  const handleChangeEventSequence = useCallback((seqId: string | null) => {
    setSelectedEventSeqId(seqId || "");
  }, []);

  const handleEventScanTypeChange = useCallback((value: string) => {
    setSelectedScanRadioAtomButton(value);
  }, []);

  const handleChangeSelectedApp = useCallback((appInfo: AppInfo) => {
    setSelectedApp(appInfo);
  }, []);

  const handleChangeSelectedFile = useCallback(
    (file: File | undefined) => setSelectedFile(file),
    [],
  );

  const handleChangeSingleUrl = useCallback((val: string) => {
    setSingleUrl(val);
    setLoadingSingleUrlSuggestions(true);
    setSingleUrlSuggestions([]);
  }, []);

  const fetchCurStatus = useCallback(async () => {
    if (!scanId) {
      return;
    }
    const status = await getScanStatus(scanId);
    //console.log("Hello", status.status, status.maxSteps, status.currentStep);
    setCurStatus(status);
  }, [scanId]);

  const handleInputScanName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setScanName(e.target.value);
    },
    [],
  );

  const handleSubmitScan = useCallback(
    async (opts: { scanWithVNC?: boolean }) => {
      if (!activeScanType || !activeScanSubType) {
        return;
      }
      switch (activeScanType) {
        case ScanType.FullPageScan: {
          navigate("/scans/fullscan");
          return;
        }
        case ScanType.SinglePageScan: {
          if (
            selectedScanRadioAtomButton === "scanWithUrl" &&
            singleUrl === ""
          ) {
            return;
          }
          break;
        }
        case ScanType.MultiPageScan: {
          if (
            selectedScanRadioAtomButton === "scanWithUrl" &&
            !scanUrls.length
          ) {
            return;
          }
          break;
        }
      }
      if (
        selectedScanRadioAtomButton === "scanWithEventSequence" &&
        !selectedEventSeqId
      ) {
        return;
      }
      if (!selectedApp) {
        return;
      }
      let chromeSeqId = "";

      if (
        selectedScanRadioAtomButton === "scanWithChromeEventSequence" &&
        selectedFile
      ) {
        const jsonObject = await readJsonFile(selectedFile);
        const chromeSeqRes = await submitChromeRRScanRequest({
          name: selectedFile.name,
          googleRecorderEvents: jsonObject,
        });
        chromeSeqId = chromeSeqRes.id;
      }

      setIsSubmitting(true);
      setScanId(undefined);
      setCurStatus(undefined);
      const scanConfig: ScanConfig = {
        url: "",
        appId: {
          id: selectedApp.appId,
          name: selectedApp.appName,
        },
        scanners: ["performance"],
        scanType: activeScanType,
        scanSubType: activeScanSubType,
        browserWindow: opts.scanWithVNC ?? false,
        scanName,
        useDefaultProfilesByScanType: true,
      };
      if (selectedScanRadioAtomButton === "scanWithUrl") {
        switch (activeScanType) {
          case ScanType.SinglePageScan: {
            scanConfig.scanUrlList = [singleUrl];
            break;
          }
          case ScanType.MultiPageScan: {
            scanConfig.scanUrlList = scanUrls;
            break;
          }
        }
      } else if (
        selectedScanRadioAtomButton === "scanWithChromeEventSequence"
      ) {
        scanConfig.scanWithEvents = chromeSeqId;
      } else {
        scanConfig.scanWithEvents = selectedEventSeqId;
      }
      try {
        console.log("scan config: ", scanConfig);
        const { scanId } = await submitScanRequest(scanConfig);
        console.log("Scan submitted: ", scanConfig);
        setScanId(scanId);
        fetchCurStatus();
        dispatch(onChangeApplication({ appInfo: selectedApp }));
      } catch (err) {
        console.log(err);
      }
      setIsSubmitting(false);
      setScanName(undefined);
    },
    [
      activeScanType,
      activeScanSubType,
      selectedScanRadioAtomButton,
      selectedEventSeqId,
      selectedApp,
      selectedFile,
      scanName,
      navigate,
      singleUrl,
      scanUrls,
      fetchCurStatus,
      dispatch,
    ],
  );

  const handleCancelScan = useCallback(async () => {
    if (scanId) {
      await cancelScanRequest(scanId);
      setScanId(undefined);
      setIsSubmitting(false);
    }
  }, [scanId]);
  const handleScanAtomButtonClick = useCallback(
    (opts: { scanWithVNC?: boolean }) => {
      if (!!isSubmitting || !!scanId) {
        handleCancelScan();
      } else {
        handleSubmitScan({
          scanWithVNC: opts.scanWithVNC,
        });
      }
    },
    [isSubmitting, scanId, handleCancelScan, handleSubmitScan],
  );

  // const scanAtomButtonText = useMemo(() => {
  //   if (!!isSubmitting || !!scanId) {
  //     return "Cancel Scan";
  //   } else {
  //     return "Scan Now";
  //   }
  // }, [scanId, isSubmitting]);

  // const handleScheduleScan = () => {
  //   navigate("/scheduler", {
  //     state: {
  //       openSchedulerModal: true,
  //       fileName: selectedFile?.name,
  //       urlList: removeRepeatingEntries(scanUrls),
  //       app: selectedApp,
  //     },
  //   });
  // };

  const removeRepeatingEntries = (arr: string[] | undefined) => {
    const urlSet: Set<string> = new Set(arr);
    return Array.from(urlSet);
  };

  const processSelectedFile = async () => {
    if (isXmlOrTextFile(selectedFile) === XML) {
      try {
        const xmlDoc = await processXmlSitemapFile(selectedFile);
        const urls = await extractUrlsFromXml(xmlDoc);
        return urls;
      } catch (error) {
        console.error(error);
      }
    } else if (isXmlOrTextFile(selectedFile) === TEXT) {
      try {
        const text = await processTextFile(selectedFile);
        const urls = await extractUrlsFromText(text);
        return urls;
      } catch (error) {
        console.error(error);
      }
    } else if (isXmlOrTextFile(selectedFile) === CHROME_RR_JSON) {
      try {
        const text = await readJsonFile(selectedFile);
        const urls = await extractUrlsFromJson(text);
        return urls;
      } catch (error) {
        console.error(error);
      }
    }
    return [];
  };

  const processSelectedFileCallback = (
    urls: string[] | undefined,
    validateSitemap: boolean = true,
  ) => {
    if (selectedFile === undefined) {
      setScanUrls(
        scanUrls.filter((element) => !inputFileUrls.includes(element)),
      );
      setInputFileUrls([]);
      setUploadSitemapDownloadData([]);
    } else {
      let validUrls = urls;
      if (validateSitemap && urls) {
        const domain = getDomainFromUrl(
          scannedUrlListQuery?.data?.length
            ? scannedUrlListQuery?.data[0]
            : undefined,
        );
        const res = validateUrls(urls, domain);
        validUrls = res.validatedUrls;
        const invalidUrlsIndices = res.invalidUrlsIndices;

        //prepare download file data
        setUploadSitemapDownloadData(
          urls.map((item, index) => {
            const downloadFileRow: SitemapDownloadFile = {
              url: item,
              source: selectedFile?.name,
            };
            if (invalidUrlsIndices.includes(index)) {
              downloadFileRow.error = "invalid url";
            }
            return downloadFileRow;
          }),
        );

        //toast message assignment
        if (urls.length - validUrls.length > 0) {
          setToastMessage(
            <div
              className="cursor-pointer"
              aria-label="Sitemap Download Button"
            >
              {`${
                urls.length - validUrls.length
              } invalid urls in sitemap are removed and not uploaded...view`}
            </div>,
          );
          setToastId("user_uploaded");
        }
      }
      //post processing handling
      const nonRepeatingSitemapUrls = removeRepeatingEntries(validUrls);
      setScanUrls(
        removeRepeatingEntries([...scanUrls, ...nonRepeatingSitemapUrls]),
      );
      if (validUrls) {
        setInputFileUrls(validUrls);
      }
    }
  };

  useEffect(() => {
    processSelectedFile().then((res) => {
      if (activeScanType === ScanType.MultiPageScan) {
        processSelectedFileCallback(res, false);
      } else {
        processSelectedFileCallback(res);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile, activeScanType]);

  useEffect(() => {
    let timeId: NodeJS.Timeout;
    if (curStatus?.errors.length || curStatus?.stateErrors?.length) {
      setToastMessage("scan failed");
      setToastId("scan_failed");
    }

    if (
      curStatus?.status === ScanStatus.Done ||
      curStatus?.status === ScanStatus.Failed
    ) {
      timeId = setTimeout(() => setScanId(undefined), 100);
    }
    return () => clearTimeout(timeId);
  }, [curStatus, scanId]);

  useEffect(() => {
    if (!scanId) {
      return;
    }
    const timeId = setInterval(fetchCurStatus, 500);
    // eslint-disable-next-line consistent-return
    return () => clearInterval(timeId);
  }, [scanId, activeScan, fetchCurStatus]);

  useEffect(() => {
    setIsSubmitting(false);
    setScanId(undefined);
    setCurStatus(undefined);
  }, [activeScan]);

  useEffect(() => {
    const timeId = setTimeout(async () => {
      if (singleUrl === "") {
        setSingleUrlSuggestions([]);
      } else {
        setSingleUrlSuggestions(await getUrlSuggestions(singleUrl));
      }
      setLoadingSingleUrlSuggestions(false);
    }, 500);

    return () => clearTimeout(timeId);
  }, [singleUrl]);

  const processScanUrls = useCallback(() => {
    if (scanUrls.length === 0) {
      return () => {};
    }
    const timeId = setTimeout(async () => {
      const apps = await getAppsByUrl(scanUrls[0]);
      if (apps.length > 0) {
        setSelectedApp({ appId: apps[0].id, appName: apps[0].name });
      } else {
        setSelectedApp(undefined);
      }
    }, 300);
    return () => clearTimeout(timeId);
  }, [scanUrls]);

  useEffect(() => {
    switch (activeScanType) {
      case ScanType.SinglePageScan: {
        if (singleUrl === "") {
          return;
        }
        const timeId = setTimeout(async () => {
          const apps = await getAppsByUrl(getFullUrl(singleUrl));
          if (apps.length > 0) {
            setSelectedApp({ appId: apps[0].id, appName: apps[0].name });
          } else {
            setSelectedApp(undefined);
          }
        }, 300);

        // eslint-disable-next-line consistent-return
        return () => {
          clearTimeout(timeId);
        };
      }
      case ScanType.MultiPageScan: {
        processScanUrls();
      }
    }
  }, [singleUrl, scanUrls, activeScanType, processScanUrls]);

  const processScanUrlsAndDomainName = useCallback((): [
    boolean,
    string | undefined,
  ] => {
    if (!scanUrls.length) {
      return [false, undefined];
    }

    const domainName = new URL(scanUrls[0]).hostname.replace("www.", "");
    return [true, domainName];
  }, [scanUrls]);

  const [showAppSelect, showAddAppName] = useMemo(() => {
    try {
      if (selectedApp) {
        return [false, undefined];
      }
      switch (activeScanType) {
        case ScanType.MultiPageScan: {
          return processScanUrlsAndDomainName();
        }
        case ScanType.FullPageScan: {
          return processScanUrlsAndDomainName();
        }
        case ScanType.SinglePageScan: {
          const domainName = new URL(getFullUrl(singleUrl)).hostname.replace(
            "www.",
            "",
          );
          return [true, domainName];
        }
        default:
          return [false, undefined];
      }
    } catch (err) {
      console.log(err);
      return [false, undefined];
    }
  }, [selectedApp, activeScanType, processScanUrlsAndDomainName, singleUrl]);

  const csvFields = [
    { label: "URL", value: "url" },
    { label: "Error", value: "error" },
    {
      label: "Source",
      value: "source",
    },
  ];

  const tableData = useMemo(
    () => [
      {
        id: "previously_scanned",
        label: "Previously Scanned Sitemap",
        data: scannedUrlListQuery?.data,
        disabled:
          scannedUrlListQuery === undefined ||
          scannedUrlListQuery?.isLoading ||
          selectedApp === undefined,
      },
      {
        id: "user_uploaded",
        label: "User Uploaded Sitemap",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: inputFileUrls?.map((item: any) => item.url),
        disabled:
          scannedUrlListQuery === undefined ||
          scannedUrlListQuery?.isLoading ||
          selectedApp === undefined, // we are using scannedurls domain to verify uploaded sitemap data
      },
    ],
    [inputFileUrls, scannedUrlListQuery, selectedApp],
  );

  // const handleRowSelection = useCallback(
  //   (filterId: string) => {
  //     const row = tableData.filter((row) => row.id === filterId)[0];
  //     const urlData = row?.data;
  //     if (selectedSitemapFilter.includes(filterId)) {
  //       setSelectedSitemapFilter(
  //         selectedSitemapFilter.filter((row) => row !== filterId)
  //       );
  //       setScanUrls(scanUrls.filter((item) => !urlData.includes(item)));
  //     } else {
  //       setSelectedSitemapFilter([...selectedSitemapFilter, filterId]);
  //       setScanUrls(removeRepeatingEntries([...scanUrls, ...urlData]));
  //     }
  //   },
  //   [tableData, selectedSitemapFilter, scanUrls]
  // );

  // const allSitemapFilter = () => {
  //   setSelectedSitemapFilter(
  //     selectedSitemapFilter.length === tableData.length
  //       ? []
  //       : tableData.map((row) => row?.id)
  //   );
  // };

  const { handleExportToCSV } = useExportToCSV({
    filename: `Sitemap-${new Date().toISOString()}`,
    parserOpts: {
      fields: csvFields,
    },
  });

  const handleDownloadSitemap = useCallback(
    (filterId: string) => {
      if (filterId === tableData[0].id) {
        handleExportToCSV(
          scannedUrlListQuery?.data?.map((item: unknown) => ({
            url: item,
            source: "Previously Scanned",
          })),
        );
      } else if (filterId === tableData[1].id) {
        handleExportToCSV(uploadSitemapDownloadData);
      }
    },
    [
      handleExportToCSV,
      scannedUrlListQuery?.data,
      tableData,
      uploadSitemapDownloadData,
    ],
  );

  const handleToastClick = useCallback(() => {
    if (toastId === "user_uploaded") {
      handleDownloadSitemap("user_uploaded");
    }
  }, [handleDownloadSitemap, toastId]);

  const statusValue = useMemo(() => {
    switch (curStatus?.status) {
      case ScanStatus.Done:
        return 1;
      case ScanStatus.Running:
      case ScanStatus.Failed:
        return curStatus.maxSteps ||
          curStatus.currentStep === curStatus.maxSteps
          ? Math.max(
              Math.min((curStatus.currentStep - 1) / curStatus.maxSteps, 0.99),
              0,
            )
          : 0.99;
      default:
        return 0;
    }
  }, [curStatus]);

  return (
    <Box className="mt-4">
      <HeadingThree
        className="text-[#545454]"
        text="Select a type of scan from the options below"
      />
      <Box className="my-4 flex w-full justify-between border bg-[#d3e2fb33] py-6 px-12">
        <ScanCard
          scanType={ScanType.SinglePageScan}
          activeScan={activeScan}
          onChangeActiveScan={setActiveScan}
        />
        <ScanCard
          scanType={ScanType.MultiPageScan}
          activeScan={activeScan}
          onChangeActiveScan={setActiveScan}
        />
        <ScanCard
          scanType={ScanType.FullPageScan}
          activeScan={activeScan}
          onChangeActiveScan={setActiveScan}
        />
      </Box>

      {activeScanType &&
        activeScanType !== ScanType.FullPageScan &&
        activeScanSubType && (
          <Box className="pb-8">
            <Stack className="items-center py-6">
              <Group className="w-full gap-10">
                <Box style={{ flex: 1 }}>
                  <Group justify="space-between">
                    <Box w="50%">
                      <Radio.Group
                        value={selectedScanRadioAtomButton}
                        onChange={handleEventScanTypeChange}
                        withAsterisk
                      >
                        <Group mb="sm">
                          <Radio value="scanWithUrl" label="Enter URL" />
                          <Radio
                            value="scanWithEventSequence"
                            label="Select Recorded Sequence"
                          />
                          <Radio
                            value="scanWithChromeEventSequence"
                            label="Select Chrome Recorded Sequence"
                          />
                        </Group>
                      </Radio.Group>
                      {selectedScanRadioAtomButton == "scanWithUrl" &&
                        (activeScanType === ScanType.SinglePageScan ? (
                          <Autocomplete
                            aria-label="Enter Url here"
                            value={singleUrl}
                            rightSection={
                              loadingSingleUrlSuggestions ? (
                                <Loader size="1rem" />
                              ) : null
                            }
                            data={singleUrlSuggestions}
                            onChange={handleChangeSingleUrl}
                            placeholder="Enter Url here"
                          />
                        ) : (
                          <UploadInput
                            onChangeFile={handleChangeSelectedFile}
                            placeholder="Upload Sitemap XML/TEXT File"
                          />
                        ))}
                      {selectedScanRadioAtomButton ===
                        "scanWithEventSequence" && (
                        <Select
                          data={sequenceSelectData}
                          searchable
                          nothingFoundMessage="Nothing found..."
                          value={selectedEventSeqId}
                          onChange={handleChangeEventSequence}
                        />
                      )}
                      {selectedScanRadioAtomButton ===
                        "scanWithChromeEventSequence" && (
                        <UploadInput
                          onChangeFile={handleChangeSelectedFile}
                          placeholder="Upload event sequence JSON File"
                        />
                      )}
                    </Box>
                    <Box>
                      <Title order={4}>Select an App below</Title>
                      <AppSelectOrCreate
                        selectedAppInfo={selectedApp}
                        onChangeSelectedApp={handleChangeSelectedApp}
                        defaultShow={showAppSelect}
                        defaultAppName={showAddAppName}
                      />
                    </Box>
                  </Group>
                </Box>
                {/* <Box
                className={clsx(
                  "w-full",
                  activeScanType !== ScanType.FullPageScan && "hidden"
                )}
              >
                <Box className="mb-3 border px-4 py-4">
                  <div className="flex items-center pb-2">
                    <HeadingOne
                      className="pr-4 text-[#545454]"
                      text={"Full App Scan"}
                    />
                    <AppSelectOrCreate
                      selectedAppInfo={selectedApp}
                      onChangeSelectedApp={handleChangeSelectedApp}
                      defaultShow={showAppSelect}
                      allowAdding={false}
                    />
                  </div>
                  <HeadingThree
                    className="pb-6 text-[#7C7C7C]"
                    text="*Only available for Apps that have finished either one “Single Page” or “Multi-Page” Scan"
                  />
                  <div className="flex items-center justify-between pb-6">
                    <div>
                      <HeadingTwo
                        className=" pb-3"
                        text="Select Scan Filter(s) below"
                      />
                      <HeadingThree
                        className="text-[#7C7C7C]"
                        text="Select one or more filters below to schedule a scan"
                      />
                    </div>
                  </div>
                  <div className="pb-4">
                    <div className="flex w-3/4 items-center justify-start">
                      <CheckBoxInput
                        className="pr-10"
                        text="Previously Scanned"
                        disabled={tableData[0].disabled}
                        checked={selectedSitemapFilter.includes(
                          tableData[0].id
                        )}
                        handleClick={() => {
                          handleRowSelection(tableData[0].id);
                        }}
                      />
                      <div className="flex">
                        <CheckBoxInput
                          className=""
                          text="Upload Sitemap"
                          disabled={tableData[1].disabled}
                          checked={selectedSitemapFilter.includes(
                            tableData[1].id
                          )}
                          handleClick={() => {
                            handleRowSelection(tableData[1].id);
                          }}
                        />
                      </div>
                    </div>
                    <div
                      className={`flex w-full items-center justify-between ${
                        selectedSitemapFilter.includes(tableData[1].id)
                          ? ""
                          : "hidden"
                      }`}
                    >
                      <UploadInput
                        className="w-full"
                        onChangeFile={handleChangeSelectedFile}
                        placeholder="Upload Sitemap XML/TEXT File"
                      />
                    </div>
                  </div>
                  <Box>
                    <SitemapTable
                      tableData={tableData}
                      selectedRows={selectedSitemapFilter}
                      handleRowSelection={handleRowSelection}
                      allSitemapFilter={allSitemapFilter}
                      handleDownloadSitemap={handleDownloadSitemap}
                      disableDownload={selectedApp === undefined}
                    />
                  </Box>
                </Box>
              </Box> */}
              </Group>
            </Stack>
            <div className={"flex items-center justify-between"}>
              <Flex className="mt-2 flex-col">
                <HeadingTwo
                  className="pb-2 text-black"
                  text="Enter Scan Name(Optional)"
                />
                <TextInput
                  name="scanName"
                  value={scanName}
                  onChange={handleInputScanName}
                  placeholder="Enter unique scan name"
                />
              </Flex>
              <Flex className="w-1/2 items-center justify-end">
                <PerfScanSettings selectedAppId={selectedApp?.appId} />
                {/* <div ref={clickOutsideRef}></div> */}
                <Group wrap="nowrap" gap={0}>
                  <Button
                    size="md"
                    style={{
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                    onClick={() =>
                      handleScanAtomButtonClick({
                        scanWithVNC: false,
                      })
                    }
                  >
                    Scan Now
                  </Button>
                  <Menu
                    transitionProps={{ transition: "pop" }}
                    position="bottom-end"
                    withinPortal
                  >
                    <Menu.Target>
                      <ActionIcon
                        aria-label="Show more options"
                        variant="filled"
                        color="primary"
                        size={rem(42)}
                        style={{
                          borderTopLeftRadius: 0,
                          borderBottomLeftRadius: 0,
                          border: 0,
                          borderLeft: "1px solid var(--mantine-color-body)",
                        }}
                      >
                        <CircleDown stroke="white" />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        onClick={() => {
                          handleScanAtomButtonClick({
                            scanWithVNC: true,
                          });
                        }}
                      >
                        Scan with live browser
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </Flex>
            </div>

            {/* <AtomButton
              className={`w-5/12 rounded-none bg-[#35ACEF] px-8 ${
                activeScanType === ScanType.FullPageScan && "hidden"
              }`}
              onClick={handleSubmitScan}
              loading={!!isSubmitting || !!scanId}
            >
              <HeadingTwo
                text={
                  !!isSubmitting || !!scanId
                    ? "In progress, please wait"
                    : "Scan Now"
                }
              />
            </AtomButton> */}
            {/* <AtomButton
              className={`w-5/12 rounded-none px-8 ${
                activeScanType !== ScanType.FullPageScan && "hidden"
              } ${
                selectedSitemapFilter?.length > 0 && selectedApp !== undefined
                  ? "bg-[#35ACEF]"
                  : ""
              }`}
              disabled={
                selectedSitemapFilter?.length === 0 || selectedApp === undefined
              }
              onClick={() => {
                handleScheduleScan();
              }}
            >
              <HeadingTwo text={"Schedule Scan"} />
            </AtomButton> */}
            {scanId && (
              <div className={"flex w-3/4 items-center gap-x-4 pb-4"}>
                <Group w="100%" mt="sm" justify="space-betwen" px="md">
                  <Box className="flex-1">
                    <Progressbar value={statusValue} className="h-4" />
                  </Box>
                  <Text variant="h3" className="text-black">{`${(
                    statusValue * 100
                  ).toFixed(0)} %`}</Text>
                </Group>
              </div>
            )}
          </Box>
        )}

      {toastMessage !== undefined && (
        <Toast
          duration={4000}
          onClose={() => {
            setToastMessage(undefined);
            setToastId(undefined);
          }}
          type="failure"
        >
          <div onClick={handleToastClick}>
            <div className="toast-message text-white">{toastMessage}</div>
          </div>
        </Toast>
      )}
    </Box>
  );
};
