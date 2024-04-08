import { Box, Button, Flex, Switch, Text } from "@mantine/core";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { changeApplicaitonInfo } from "@/api";
import { useRulesData } from "@/api/useRequest";
import { Settings } from "@/icons/Settings";
import { PageHeader } from "@/molecules/PageHeader";
import { selectApplicationInfo } from "@/reduxStore/app/app.reducer";
import { RulesTable } from "@/templates/Rules";
import RulesPageContext from "@/templates/Rules/RulesPageContext";

import { useApplicationData } from "../../../Sameer/lib/application/use-application-data";

// eslint-disable-next-line @typescript-eslint/ban-types
export type RulesPageProps = {};

export const RulesPage: React.FC<RulesPageProps> = () => {
  const navigate = useNavigate();
  const rulesQuery = useRulesData();
  const selectedAppId = useSelector(selectApplicationInfo)?.appId;
  const appInfoQuery = useApplicationData({ appId: selectedAppId || "" });
  const [rulesData, setRulesData] = useState<ApplicationRuleMeta[]>([]);
  const [debounceTimeId, setDebounceTimeId] = useState<NodeJS.Timeout>();
  const [showOnlyValidLevels, setShowOnlyValidLevels] = useState(true);
  const [enableAllRulesForScan, setEnableAllRulesForScan] = useState(false);
  const [automatedTicketForAllRules, setAutomatedTicketForAllRules] =
    useState(false);

  const filteredRulesData = useMemo(
    () =>
      showOnlyValidLevels
        ? rulesData.filter(
            (rule) => rule.detailLevel === "A" || rule.detailLevel === "AA",
          )
        : rulesData,
    [rulesData, showOnlyValidLevels],
  );

  useEffect(() => {
    if (!rulesQuery.data || !appInfoQuery.data) {
      return;
    }
    const {
      enableAllRules,
      enabledRules,
      createJiraForAllRules,
      createJiraForRules,
    } = appInfoQuery.data;
    setRulesData(
      rulesQuery.data.map<ApplicationRuleMeta>((rule) => ({
        ...rule,
        ruleStatus: enableAllRules
          ? true
          : enabledRules?.includes(rule.id) || false,
        jiraStatus: createJiraForAllRules
          ? true
          : createJiraForRules?.includes(rule.id) || false,
      })),
    );
  }, [appInfoQuery.data, rulesQuery.data]);

  const handleUpdateServer = useCallback(
    (rulesData: ApplicationRuleMeta[]) => {
      clearTimeout(debounceTimeId);
      const timeId = setTimeout(async () => {
        if (!selectedAppId) {
          return;
        }
        const statusValue: ApiApplicationChange = {};
        statusValue.enabledRules = rulesData
          .filter(({ ruleStatus }) => ruleStatus)
          .map(({ id }) => id);
        if (statusValue.enabledRules.length === rulesData.length) {
          statusValue.enableAllRules = true;
          statusValue.enabledRules = [];
        } else {
          statusValue.enableAllRules = false;
        }
        statusValue.createJiraForRules = rulesData
          .filter(({ jiraStatus }) => jiraStatus)
          .map(({ id }) => id);
        if (statusValue.enabledRules.length === rulesData.length) {
          statusValue.createJiraForAllRules = true;
          statusValue.createJiraForRules = [];
        } else {
          statusValue.createJiraForAllRules = false;
        }

        await changeApplicaitonInfo(selectedAppId, statusValue);
      }, 500);
      setDebounceTimeId(timeId);
    },
    [selectedAppId, debounceTimeId],
  );

  const handleUpdateRuleOrJiraStatus = useCallback(
    (ruleIds: string[], isRuleStatus = true) => {
      let newRulesData: ApplicationRuleMeta[] = [];
      if (isRuleStatus) {
        const newRuleStatus = !filteredRulesData
          .filter(({ id }) => ruleIds.includes(id))
          .some(({ ruleStatus }) => ruleStatus);
        newRulesData = filteredRulesData.map((rule) =>
          ruleIds.includes(rule.id)
            ? { ...rule, ruleStatus: newRuleStatus }
            : rule,
        );
      } else {
        const newJiraStatus = !filteredRulesData
          .filter(({ id }) => ruleIds.includes(id))
          .some(({ jiraStatus }) => jiraStatus);
        newRulesData = filteredRulesData.map((rule) =>
          ruleIds.includes(rule.id)
            ? { ...rule, jiraStatus: newJiraStatus }
            : rule,
        );
      }
      setRulesData(newRulesData);
      handleUpdateServer(newRulesData);
    },
    [filteredRulesData, handleUpdateServer],
  );

  useEffect(() => {
    setEnableAllRulesForScan(
      filteredRulesData.every(({ ruleStatus }) => ruleStatus),
    );
    setAutomatedTicketForAllRules(
      filteredRulesData.every(({ jiraStatus }) => jiraStatus),
    );
  }, [filteredRulesData]);

  const handleChangeEnableAllRules = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newRulesData = rulesData.map((rule) => ({
        ...rule,
        ruleStatus: e.target.checked,
      }));
      setRulesData(newRulesData);
      handleUpdateServer(newRulesData);
    },
    [handleUpdateServer, rulesData],
  );

  const handleChangeShowLevels = useCallback(() => {
    setShowOnlyValidLevels((val) => !val);
  }, []);

  const handleChangeAutomaticTicketForRules = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newRulesData = rulesData.map((rule) => ({
        ...rule,
        jiraStatus: e.target.checked,
      }));
      setRulesData(newRulesData);
      handleUpdateServer(newRulesData);
    },
    [handleUpdateServer, rulesData],
  );

  const handleClickConfiguration = useCallback(() => {
    navigate("/rules/configuration");
  }, [navigate]);

  if (!rulesData.length) {
    return <Text>Loading...</Text>;
  }
  return (
    <RulesPageContext.Provider
      value={{
        onUpdateRuleOrJiraStatus: handleUpdateRuleOrJiraStatus,
      }}
    >
      <Box py="sm" px="lg">
        <PageHeader
          title="RULES"
          className="mt-1.5"
          rightElement={
            <Button
              rightSection={<Settings />}
              onClick={handleClickConfiguration}
            >
              Configuration
            </Button>
          }
        />
        <Box mt="md">
          <Flex gap="md" justify="flex-end">
            <Flex align="center">
              <Switch
                checked={showOnlyValidLevels}
                onChange={handleChangeShowLevels}
                label="Show only A or AA"
              />
            </Flex>
            <Flex align="center">
              <Switch
                checked={enableAllRulesForScan}
                onChange={handleChangeEnableAllRules}
                label="Enable All Rules for Scan"
              />
            </Flex>
            <Flex align="center">
              <Switch
                checked={automatedTicketForAllRules}
                onChange={handleChangeAutomaticTicketForRules}
                label="Automated Service Ticket for all rules"
              />
            </Flex>
          </Flex>
        </Box>
        <Box mt="md">
          <RulesTable rulesData={filteredRulesData} />
        </Box>
      </Box>
    </RulesPageContext.Provider>
  );
};
