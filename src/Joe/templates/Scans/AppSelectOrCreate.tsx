import { CircleDown } from "@/icons/CircleDown";
import { CircleUp } from "@/icons/CircleUp";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Skeleton } from "../../../Sameer/components/atoms/loading/skeleton";
import { useAllApplicationData } from "../../../Sameer/lib/application/use-application-data";
import { postAddApp } from "@/api";
import { toast } from "react-toastify";
import { Box, Button, ComboboxItem, Popover, rem, Select, Text, TextInput, Title } from "@mantine/core";

type AppInfo = {
  appId: string;
  appName: string;
};

type AppSelectOrCreateProps = {
  defaultShow?: boolean;
  defaultAppName?: string;
  selectedAppInfo?: AppInfo;
  allowAdding?: boolean;
  onChangeSelectedApp: (appInfo: AppInfo) => void;
};

const AppSelectionAction = ({
  onAppSelect,
  selectedAppId,
  defaultAppName = "",
  allowAdding = true,
}: {
  onAppSelect?: (appInfo: AppInfo) => void;
  selectedAppId?: string;
  defaultAppName?: string;
  allowAdding?: boolean;
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const allApplicationDataQuery = useAllApplicationData();
  const [appName, setAppName] = useState("");

  useEffect(() => {
    setAppName(defaultAppName);
    if (defaultAppName !== "") {
      setIsAdding(true);
    }
  }, [defaultAppName]);

  const handleClickAdd = () => {
    setIsAdding(true);
  };

  const handleSubmitAdd = async () => {
    setIsProcessing(true);
    postAddApp(appName).catch((error) => toast(error));
    setAppName("");
    setIsProcessing(false);
    await allApplicationDataQuery.refetch();
    setIsAdding(false);
    onAppSelect?.({
      appId: appName,
      appName,
    });
  };

  const handleChangeAppName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppName(e.target.value);
  };

  const handleChangeSelectedApp = useCallback((val: string | null) => {
    if (val === null) {
      return;
    }
    const appInfo = allApplicationDataQuery.data?.find(({id}) => id === val);
    if (!appInfo) {
      return;
    }
    onAppSelect?.({
      appId: appInfo.id,
      appName: appInfo.name,
    });
  }, [allApplicationDataQuery.data, onAppSelect]);
  
  const dropdownItems = useMemo<ComboboxItem[]>(() => 
  allApplicationDataQuery.data ? allApplicationDataQuery.data.map(({id, name}, index) => ({
      label: name,
      value: id ?? index,
    })) : []
  , [allApplicationDataQuery.data]);



  if (allApplicationDataQuery.isLoading){
    return <Skeleton className="h-24 !w-full" />;
  }

  if (allApplicationDataQuery.isError) {
    return <div>Error</div>;
  }

  if (allowAdding && isAdding) {
    return (
      <>
        <Title order={4}>Add a new App</Title>
        <TextInput
          my="md"
          label="App Name"
          value={appName}
          onChange={handleChangeAppName}
          w="100%"
          placeholder="Enter App Name here"
        />
        <Button
          w="100%"
          disabled={appName === ""}
          loading={isProcessing}
          onClick={handleSubmitAdd}
        >
          <Text tt="uppercase">Add App</Text>
        </Button>
      </>
    );
  }

  return (
    <Box py="md" px="sm">
      <Select
        aria-label="Select application"
        comboboxProps={{withinPortal: false}}
        checkIconPosition="left"
        value={selectedAppId}
        onChange={handleChangeSelectedApp}
        data={dropdownItems}
        dropdownOpened
        limit={100}
        pb={rem(180)}
        placeholder="Quick search"
        searchable
        maxDropdownHeight={rem(160)}
      />
      {allowAdding && (
        <Button mt="md" w="100%" onClick={handleClickAdd}>
          <Text tt="uppercase">Add App</Text>
        </Button>
      )}
    </Box>
  );
};

export const AppSelectOrCreate: React.FC<AppSelectOrCreateProps> = ({
  selectedAppInfo,
  onChangeSelectedApp,
  defaultShow = false,
  defaultAppName = "",
  allowAdding = true,
}) => {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    setOpened(defaultShow);
  }, [defaultShow]);

  const handleChangeSelectedApp = useCallback((appInfo: AppInfo) => {
    setOpened(false);
    onChangeSelectedApp(appInfo);
  }, [onChangeSelectedApp]);
  const handleClickSelectButton = useCallback(() => {
    setOpened(v => !v);
  }, []);
  
  const dropdownIcon = useMemo(() => opened ? (
    <CircleUp
      role="presentation"
      className="fill-white !stroke-[#F86F80]"
    />
  ) : (
    <CircleDown
      role="presentation"
      className="fill-white !stroke-[#F86F80]"
    />
  ), [opened])

  return (
    
    <Popover 
      opened={opened} 
      onChange={setOpened} 
      trapFocus 
      transitionProps={{transition: "fade"}}
      position="bottom-start" 
      withinPortal={false}
    >
      <Popover.Target>
        <Button 
          color="accent" 
          onClick={handleClickSelectButton}
          rightSection={dropdownIcon}
          w={rem(300)}
          justify="space-between"
        >
          <Text mr="sm" >
            App: 
          </Text>
          <Text fw={500} truncate="end">
            {selectedAppInfo?.appName
              ? selectedAppInfo.appName
              : "Select an Application"}
          </Text>
        </Button>
      </Popover.Target>
      <Popover.Dropdown w={rem(300)}>
        <AppSelectionAction
          onAppSelect={handleChangeSelectedApp}
          selectedAppId={selectedAppInfo?.appId}
          defaultAppName={defaultAppName}
          allowAdding={allowAdding}
        />
      </Popover.Dropdown>
    </Popover>
  )
};

