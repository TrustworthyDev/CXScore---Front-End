import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Modal, ModalHeader, TemplateProps } from "@/atoms/Modal";
import { Text } from "@/atoms/Text";
import { AppSelectOrCreate } from "../Scans/AppSelectOrCreate";
import { Flex } from "@/atoms/Flex";
import { TextInput } from "@/atoms/TextInput";
import ConfirmationButtons from "@/atoms/Modal/ConfirmationButtons";
import {
  ScanSubType,
  ScanType,
  ScheduleEndType,
  SchedulerFrequency,
} from "@/types/enum";
import { UploadInput } from "@/atoms/UploadInput";
import { SuggestionInput } from "@/atoms/SuggestionInput";
import { addScheduler, getUrlSuggestions, submitScanRequest } from "@/api";
import { getFormattedTime, getFullUrl } from "@/utils/stringUtils";
import { onChangeApplication } from "@/reduxStore/app/app.actions";
import { useDispatch } from "react-redux";
import { Option } from "react-dropdown";
import { Dropdown } from "@/atoms/Dropdown";
import moment from "moment";

type AppInfo = {
  appId: string;
  appName: string;
};

export type CreateSchdulerModalTemplateProps = {
  refetchTable: () => void;
  showUrlInputBox?: boolean;
  fileName?: string;
  urlList?: string[];
  app?: AppInfo;
};

const frequencyOptions: Option[] = [
  { label: "Daily", value: SchedulerFrequency.Daily },
  // { label: "Weekly", value: SchedulerFrequency.Weekly },
  // { label: "Monthly", value: SchedulerFrequency.Monthly },
  // { label: "Quarterly", value: SchedulerFrequency.Quarterly },
];

const scanTypeOptions: Option[] = [
  { label: "Rapid Scan", value: ScanSubType.RapidScan },
  { label: "Deep Scan", value: ScanSubType.DeepScan },
];

export const CreateSchdulerModalTemplate: React.FC<
  TemplateProps<CreateSchdulerModalTemplateProps>
> = ({ modalProps, refetchTable, showUrlInputBox, fileName, urlList, app }) => {
  const dispatch = useDispatch();
  const [singleUrl, setSingleUrl] = useState("");
  const [singleUrlSuggestions, setSingleUrlSuggestions] = useState<string[]>(
    []
  );

  const [scanUrls, setScanUrls] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [selectedEndType, setSelectedEndType] = useState<ScheduleEndType>(
    ScheduleEndType.Never
  );
  const [urlInputType, setInputType] = useState<string>("");
  const [selectedApp, setSelectedApp] = useState<AppInfo>();
  const [isLoadingUrls, setIsLoadingUrls] = useState(false);

  // useEffect(() => {
  //   const a = "8:30";
  //   const timeVals = a.split(":");
  //   const timeOfDayInSeconds =
  //     (Number(timeVals[0]) * 60 +
  //       Number(timeVals[1]) +
  //       new Date().getTimezoneOffset()) *
  //     60;

  //   console.log(getFormattedTime(timeOfDayInSeconds));
  // }, []);

  const [formValues, setFormValues] = useState({
    endDate: "",
    startDate: "",
    timeOfDay: "",
    scanName: "",
    frequency: SchedulerFrequency.Daily,
    scanType: ScanSubType.RapidScan,
  });

  useEffect(() => {
    const timeId = setTimeout(async () => {
      if (singleUrl === "") {
        setSingleUrlSuggestions([]);
      } else {
        setSingleUrlSuggestions(await getUrlSuggestions(singleUrl));
      }
    }, 500);

    return () => clearTimeout(timeId);
  }, [singleUrl]);

  useEffect(() => {
    if (selectedFile) {
      const textType = /text.*/;
      const reader = new FileReader();
      if (selectedFile.type.match(textType)) {
        setIsLoadingUrls(true);
        reader.onload = () => {
          const content = reader.result as string;
          const scanUrls = content
            .replaceAll("\r", "")
            .replaceAll(",", "\n")
            .trim()
            .split("\n")
            .filter((url) => url.length > 0)
            .map((url) => getFullUrl(url));
          setScanUrls(scanUrls);
          setIsLoadingUrls(false);
        };
        reader.readAsText(selectedFile);
      }
    }
  }, [selectedFile]);

  const handleChangeSelectedApp = useCallback((appInfo: AppInfo) => {
    setSelectedApp(appInfo);
  }, []);
  const handleChangeEndType = useCallback((type: ScheduleEndType) => {
    setSelectedEndType(type);
  }, []);
  const handleChangeInputType = useCallback((type: string) => {
    setInputType(type);
  }, []);

  const handleChangeFormValues = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues((vals) => ({ ...vals, [e.target.name]: e.target.value }));
    },
    []
  );

  const handleChangeSingleUrl = useCallback(
    (val: string) => setSingleUrl(val),
    []
  );

  const handleChangeSelectedFile = useCallback(
    (file: File | undefined) => setSelectedFile(file),
    []
  );

  const handleChangeFrequency = useCallback(
    (opt: Option) =>
      setFormValues((vals) => ({
        ...vals,
        frequency: opt.value as SchedulerFrequency,
      })),
    []
  );

  const handleChangeScanType = useCallback(
    (opt: Option) =>
      setFormValues((vals) => ({
        ...vals,
        scanType: opt.value as ScanSubType,
      })),
    []
  );

  const handleConfirm = useCallback(async () => {
    if (!selectedApp) {
      return;
    }
    let scanUrlList: string[] = [singleUrl];
    if (urlInputType === "upload") {
      scanUrlList = scanUrls;
    }
    const timeVals = formValues.timeOfDay.split(":").map((s) => Number(s));
    if (timeVals.length < 2) {
      return;
    }
    let timeMin = timeVals[0] * 60 + timeVals[1];
    timeMin = (timeMin + new Date().getTimezoneOffset() + 24 * 60) % (24 * 60);

    let scheduleConfig: ScheduleConfig = {
      applicationId: selectedApp.appId,
      scanName: formValues.scanName,
      urlList: urlInputType === "upload" ? scanUrls : [singleUrl],
      scanType: ScanSubType.RapidScan,
      frequency: formValues.frequency,
      startDate: formValues.startDate,
      endDate:
        selectedEndType === ScheduleEndType.Never
          ? "never"
          : formValues.endDate || "never",
      timeOfDayInSeconds: timeMin * 60,
    };

    try {
      const { id: scheduleId } = await addScheduler(scheduleConfig);
      refetchTable();
      dispatch(onChangeApplication({ appInfo: selectedApp }));
    } catch (err) {
      console.log(err);
    }
  }, [
    urlInputType,
    selectedEndType,
    singleUrl,
    scanUrls,
    formValues,
    selectedApp,
    refetchTable,
  ]);

  const validFormVals = useMemo<boolean>(() => {
    if (
      !selectedApp ||
      (urlInputType === "upload" && scanUrls.length === 0) ||
      (urlInputType === "" && singleUrl.length === 0)
    ) {
      return false;
    }
    if (formValues.startDate === "") {
      return false;
    }
    return true;
  }, [
    urlInputType,
    selectedEndType,
    singleUrl,
    scanUrls,
    formValues,
    selectedApp,
  ]);

  useEffect(() => {
    if (urlList && app) {
      setScanUrls(urlList);
      setInputType("upload");
      setSelectedApp(app);
    }
  }, [urlList, app]);

  return (
    <Modal
      {...modalProps}
      header={<ModalHeader title="Create a Schedule Scan" />}
      actionButtons={
        <>
          <ConfirmationButtons
            onClose={modalProps.onClose}
            confirmationLabel={"CREATE SCAN"}
            confirmationDisabled={isLoadingUrls || !validFormVals}
            onConfirm={handleConfirm}
          />
        </>
      }
      modalContentStyle="w-[40rem]"
    >
      <Flex className="flex-col">
        <Text className="text-black">Select an App</Text>
        <AppSelectOrCreate
          selectedAppInfo={selectedApp}
          onChangeSelectedApp={handleChangeSelectedApp}
        />
      </Flex>
      <Flex className="mt-2 flex-col">
        <Text className="text-black">Enter Scan Name</Text>
        <TextInput
          name="scanName"
          value={formValues.scanName}
          onChange={handleChangeFormValues}
        />
      </Flex>
      <Flex className="mt-2 flex-col">
        <Text variant="h3" className="text-black">
          Scan Type
        </Text>
        <Dropdown
          options={scanTypeOptions}
          value={formValues.scanType}
          onChange={handleChangeScanType}
        />
      </Flex>

      <div className={`${!showUrlInputBox && "hidden"}`}>
        <Flex
          className={`mt-2 items-center gap-x-4 ${
            !showUrlInputBox && "hidden"
          }`}
        >
          <Flex
            className="cursor-pointer items-center gap-x-2"
            onClick={() => handleChangeInputType("")}
          >
            <input type="radio" checked={urlInputType !== "upload"} />
            <Text className="text-black">Enter Url</Text>
          </Flex>
          <Flex
            className="cursor-pointer items-center gap-x-2"
            onClick={() => handleChangeInputType("upload")}
          >
            <input type="radio" checked={urlInputType === "upload"} />
            <Text className="text-black">Upload a file</Text>
          </Flex>
        </Flex>
        {urlInputType === "upload" ? (
          <UploadInput
            onChangeFile={handleChangeSelectedFile}
            placeholder="Upload Sitemap XML/TEXT File"
          />
        ) : (
          <SuggestionInput
            placeholder="https://www.company.com"
            onChangeText={handleChangeSingleUrl}
            value={singleUrl}
            suggestions={singleUrlSuggestions}
          />
        )}
      </div>
      <Flex className="mt-2 flex-col gap-2">
        <Flex>
          <Flex className="flex-1 items-center gap-2">
            <Text variant="h3" className="text-black">
              Every
            </Text>
            <Dropdown
              options={frequencyOptions}
              value={formValues.frequency}
              onChange={handleChangeFrequency}
            />
          </Flex>
          <Flex className="ml-4 flex-1 items-center gap-2">
            <Text variant="h3" className="text-black">
              At
            </Text>
            <TextInput
              type="time"
              name="timeOfDay"
              value={formValues.timeOfDay}
              onChange={handleChangeFormValues}
            />
          </Flex>
        </Flex>

        <Flex className="items-center gap-2">
          <Text variant="h3" className="text-black">
            Starting
          </Text>
          <TextInput
            type="date"
            name="startDate"
            value={formValues.startDate}
            onChange={handleChangeFormValues}
          />
        </Flex>
        <Flex className="items-center gap-2">
          <Text variant="h3" className="text-black">
            Ends on
          </Text>
          <Flex className="items-center space-x-4">
            <Flex
              className="cursor-pointer items-center space-x-2"
              onClick={() => handleChangeEndType(ScheduleEndType.Never)}
            >
              <input
                type="radio"
                checked={selectedEndType === ScheduleEndType.Never}
              />
              <Text className="text-black">Never</Text>
            </Flex>
            <Flex
              className="cursor-pointer items-center space-x-2"
              onClick={() => handleChangeEndType(ScheduleEndType.Date)}
            >
              <input
                type="radio"
                checked={selectedEndType === ScheduleEndType.Date}
              />
              <TextInput
                type="date"
                name="endDate"
                value={formValues.endDate}
                onChange={handleChangeFormValues}
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Modal>
  );
};
