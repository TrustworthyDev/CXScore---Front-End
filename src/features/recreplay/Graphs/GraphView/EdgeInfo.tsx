/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, List, Text } from "@mantine/core";

export function EdgeInfo(props: any) {
  const { events } = props;
  if (!events || events.length == 0) {
    return null;
  }
  return (
    <Box>
      <Text>Selected Edge</Text>
      <List>
        {events.map((e: any, index: number) => (
          <List.Item key={`edgeinfo ${index}`}>
            <Text>{e.eventString}</Text>
            <Text>{e.path}</Text>
          </List.Item>
        ))}
      </List>
    </Box>
  );
}
