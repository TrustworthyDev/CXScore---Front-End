import {
  Center,
  List,
  LoadingOverlay,
  MantineStyleProp,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Record from "~/icons/Record";

// type SequenceInfo = {
//   id: string;
//   appId: string;
//   baseUrl: string;
//   sequenceName: string;
//   startDate: string;
//   endDate: string;
//   eventSequence: BrowserEvent[];
// };

interface SequenceListProps {
  items: ApiSequenceDetail[];
  isLoading?: boolean;
}

export const SequenceList: React.FC<SequenceListProps> = ({
  items,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const handleClickItem = useCallback(
    (item: ApiSequenceDetail) => {
      navigate(`/recreplay/replay-session/${item.id}`);
    },
    [navigate]
  );

  if (isLoading) {
    return (
      <Center style={containerStyle}>
        <LoadingOverlay visible={true} />
      </Center>
    );
  }
  if (items.length === 0) {
    return (
      <Center style={containerStyle}>
        <Stack align="center" gap="xxs">
          <Text size="xl">No recorded event sequence.</Text>
          <Text size="md">
            You need create sequence by clicking start record button.
          </Text>
        </Stack>
      </Center>
    );
  }
  return (
    <ScrollArea style={containerStyle} p="md">
      <List spacing="md" icon={<Record noShadow fill="red" />}>
        {items
          .map((seq) => (
            <List.Item
              key={`${seq.id}`}
              style={itemStyle}
              onClick={() => handleClickItem(seq)}
            >
              <Title order={4}>{seq.name || "N/A"}</Title>
              <Text>{`Sequence Id: ${seq.id}`}</Text>
              <Text>{`Event List: ${seq.eventSequence.length} entries`}</Text>
            </List.Item>
          ))
          .reverse()}
      </List>
    </ScrollArea>
  );
};

const containerStyle: MantineStyleProp = () => ({
  //backgroundColor: theme.colors.gray[3],
  height: "100%",
  width: "100%",
});

const itemStyle: MantineStyleProp = () => ({
  borderBottomWidth: "1px",
  cursor: "pointer",
});
