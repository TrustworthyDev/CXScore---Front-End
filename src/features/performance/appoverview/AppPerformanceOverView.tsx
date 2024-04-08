import {
  Box,
  Button,
  Divider,
  Grid,
  Group,
  Image,
  Paper,
  Stack,
  Switch,
  Text,
  Title,
  rem,
} from "@mantine/core";
import React, { useCallback, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAppPerfOverview } from "@/api/useRequest";
import { DeviceType, PerfMetricType } from "@/types/enum";
import images from "~/assets";
import { SpeedoMeter } from "~/features/shared/charts/SpeedoMeter";
import { Loading } from "~/Sameer/components/atoms/loading";

import { AppScoreCard } from "./AppScoreCard";
import { UrlOverviewList } from "./UrlOverviewList";
import { UrlOverviewMetricTable } from "./UrlOverviewMetricTable";
import PerformanceContext from "../PerformanceContext";

interface Props {}

const metrics: PerfMetricType[] = [
  // PerfMetricType.TTFB,
  PerfMetricType.LCP,
  PerfMetricType.TBT,
  PerfMetricType.FCP,
  PerfMetricType.SI,
  PerfMetricType.CLS,
  PerfMetricType.INP,
];

type Params = {
  appId: string;
};

export const AppPerformanceOverview: React.FC<Props> = () => {
  const { appId } = useParams<Params>();
  const navigate = useNavigate();
  const { isMobile, onChangeDevice } = useContext(PerformanceContext);

  const { data: perfOverview } = useAppPerfOverview({ appId: appId || "" });

  const handleChangeDevice = useCallback(() => {
    onChangeDevice(!isMobile);
  }, [isMobile, onChangeDevice]);

  const handleClickNewScan = useCallback(() => {
    navigate("/performance");
  }, [navigate]);

  if (!perfOverview) {
    return <Loading />;
  }

  return (
    <Box p="md">
      <Group justify="space-between">
        <Title c="primary" order={3}>
          {appId}
        </Title>

        <Switch
          size="xl"
          onLabel="Mobile"
          offLabel="Desktop"
          checked={isMobile}
          onChange={handleChangeDevice}
        />
      </Group>
      <Group align="start" gap="xl" mx="md">
        <Box style={{ flex: 1 }}>
          <Group mb="lg">
            <Paper h={rem(100)} p="lg" shadow="md" radius="lg">
              <Image src={images.appLogoImg} my="auto" h="100%" w="auto" />
            </Paper>
            <Paper shadow="md" px="lg" radius="lg" h={rem(100)}>
              <Box my="auto">
                <Text fz="2xl" fw="bold" ta="center" c="primary">
                  {perfOverview.urlList.length}
                </Text>
                <Text ta="center" c="primary">
                  {perfOverview.urlList.length > 1 ? "Pages" : "Page"}
                </Text>
              </Box>
            </Paper>
            <Divider orientation="vertical" size="sm" />
            <Box style={{ flex: 1 }}>
              <Grid columns={3}>
                {metrics.map((metric) => (
                  <Grid.Col span={1} key={metric}>
                    <AppScoreCard
                      metric={
                        perfOverview.aggregateMetrics[
                          isMobile ? DeviceType.MOBILE : DeviceType.DESKTOP
                        ][metric]
                      }
                    />
                  </Grid.Col>
                ))}
              </Grid>
            </Box>
          </Group>
          <UrlOverviewList urlPerfDetailList={perfOverview.urlList} />
          <UrlOverviewMetricTable urlPerfDetailList={perfOverview.urlList} />
        </Box>
        <Stack w={rem(250)} px="lg">
          <Text mb="md" mx="auto">
            Real time CX Score
          </Text>
          <Paper shadow="md" radius="md" p="md" mb="lg">
            <SpeedoMeter
              value={
                perfOverview.aggregateMetrics[
                  isMobile ? DeviceType.MOBILE : DeviceType.DESKTOP
                ][PerfMetricType.PS]?.value[0] * 100
              }
            />
          </Paper>
          <Button variant="outline" mx="md">
            Scan all pages
          </Button>
          <Button mx="md" onClick={handleClickNewScan}>
            New scan
          </Button>
          <Button variant="transparent" color="black" mt="lg">
            Edit App
          </Button>
          <Button variant="transparent" color="accent">
            Delete App
          </Button>
        </Stack>
      </Group>
    </Box>
  );
};
