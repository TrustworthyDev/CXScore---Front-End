import { Box, Group, Image, Paper, Text, Title, rem } from "@mantine/core";
import React from "react";

import images from "~/assets";

type Props = {
  title: string;
  score: number;
};

export const ScoreCard: React.FC<Props> = ({ title, score }) => {
  return (
    <Paper radius="lg" withBorder shadow="md">
      <Group justify="space-around" px="xl" py="md" gap="xl">
        <Image src={images.heartRateGif} w={rem(52)} />
        <Title order={2} c="primary">{`${(score * 100).toFixed(0)}%`}</Title>
      </Group>
      <Box
        bg="primary"
        w="100%"
        p="md"
        style={{
          borderBottomRightRadius: "var(--mantine-radius-lg)",
          borderBottomLeftRadius: "var(--mantine-radius-lg)",
        }}
      >
        <Text ta="center" c="white">
          {title}
        </Text>
      </Box>
    </Paper>
  );
};
