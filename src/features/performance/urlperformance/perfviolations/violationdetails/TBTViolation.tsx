import {
  Box,
  Button,
  Center,
  Divider,
  Group,
  Pagination,
  Text,
  Title,
  rem,
} from "@mantine/core";
import React, { useCallback, useEffect, useMemo, useState } from "react";

interface Props {
  violation: ApiPerfViolation;
}

type LongTask = {
  duration: number;
  url: string;
  startTime: number;
};

export const TBTViolation: React.FC<Props> = ({ violation }) => {
  const [curTask, setCurTask] = useState(0);
  const [durationInd, setDurationInd] = useState(0);
  const [longTasks, tasksIndByDuration, startPoint, endPoint, totalDuration] =
    useMemo(() => {
      const longTasks = (
        violation.details
          .flat()
          .filter((v) => v?.id === "long-tasks")
          .map((v) => (v.details?.type === "table" ? v.details.items : []))
          .flat() as LongTask[]
      ).sort((a, b) => a.startTime - b.startTime);
      if (longTasks.length === 0) {
        return [[], [], 0, 0, 0];
      }
      const startPoint = longTasks[0].startTime;
      const endPoint =
        longTasks[longTasks.length - 1].startTime +
        longTasks[longTasks.length - 1].duration;
      return [
        longTasks,
        Array.from({ length: longTasks.length }, (_, i) => i).sort(
          (a, b) => longTasks[b].duration - longTasks[a].duration,
        ),
        startPoint,
        endPoint,
        longTasks.reduce((acc, cur) => acc + cur.duration, 0),
      ];
    }, [violation.details]);
  const handleChangeCurTask = useCallback(
    (ind: number) => {
      setCurTask(ind);
      setDurationInd(tasksIndByDuration.indexOf(ind));
    },
    [tasksIndByDuration],
  );

  const handleChangeDurationInd = useCallback(
    (ind: number) => {
      setDurationInd(ind - 1);
      setCurTask(tasksIndByDuration[ind - 1]);
    },
    [tasksIndByDuration],
  );

  useEffect(() => {
    setCurTask(tasksIndByDuration.at(0) ?? 0);
    setDurationInd(0);
  }, [tasksIndByDuration]);

  const timeLength = endPoint - startPoint;
  return (
    <Box p="lg">
      <Group mb="xl" align="end">
        <Title order={3} ta="left">
          {`Task Timeline (${longTasks.length} long tasks)`}
        </Title>
        <Text c="red" fw="bold">{`${totalDuration.toFixed(2)} ms`}</Text>
      </Group>
      <Center pos="relative" h={rem(20)} mb="lg">
        <Divider orientation="horizontal" my="auto" w="100%" size="sm" />
        {longTasks.map((task, ind) => (
          <Box
            key={`${task.startTime}`}
            w={`${((task.duration / timeLength) * 100).toFixed(4)}%`}
            h="100%"
            pos="absolute"
            style={{
              left: `${(((task.startTime - startPoint) / timeLength) * 100).toFixed(4)}%`,
            }}
            pr={1}
          >
            <Button
              w="100%"
              h="100%"
              radius="0"
              p={0}
              color={curTask === ind ? "red" : "yellow"}
              onClick={() => handleChangeCurTask(ind)}
            />
          </Box>
        ))}
      </Center>
      <Box ml="md">
        <Text ta="left" size="lg">{`Task${curTask + 1} detail`}</Text>
        <Box ml="md" mb="lg">
          <Text ta="left">
            {`Duration: ${longTasks[curTask].duration.toFixed(2)} ms (${((longTasks[curTask].duration / totalDuration) * 100).toFixed(2)} %)`}
          </Text>
          <Text ta="left">{`Start time: ${longTasks[curTask].startTime.toFixed(2)} ms`}</Text>
          <Text
            ta="left"
            style={{ wordBreak: "break-all" }}
          >{`Url: ${longTasks[curTask].url}`}</Text>
        </Box>

        <Pagination.Root
          total={longTasks.length}
          size="sm"
          value={durationInd + 1}
          onChange={handleChangeDurationInd}
        >
          <Group gap={5} justify="center">
            <Text mr="md">Longest</Text>
            <Pagination.First />
            <Pagination.Previous />
            <Pagination.Items />
            <Pagination.Next />
            <Pagination.Last />
            <Text ml="md">Shortest</Text>
          </Group>
        </Pagination.Root>
      </Box>
    </Box>
  );
};
