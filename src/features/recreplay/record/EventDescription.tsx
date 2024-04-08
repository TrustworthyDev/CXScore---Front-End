import { Box, Checkbox, MantineTheme, Text } from "@mantine/core";
import React from "react";

type EventDescriptionProps = {
  event: BrowserEvent;
  disableStateControl?: boolean;
  onSetState: (checked: boolean) => void;
};
export const EventDescription: React.FC<EventDescriptionProps> = ({
  event,
  disableStateControl = false,
  onSetState,
}) => {
  const handleChangeStateCheck = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onSetState(event.target.checked);
  };
  switch (event.type) {
    case "navigate":
      return (
        <Box>
          <Text>{`Url: ${event.url}`}</Text>
          <Checkbox
            mt="sm"
            label="Create state"
            styles={stateCreateStyle}
            size="xs"
            checked={event.tag === "create_state"}
            onChange={handleChangeStateCheck}
            disabled={disableStateControl}
          />
        </Box>
      );
    case "change":
    case "click":
      return (
        <Box>
          <Text>Element selectors:</Text>
          <Box ml="sm">
            {event.selectorOptions.map((option) => (
              <Text key={option.type} size="xs">{`${
                option.type
              } - ${JSON.stringify(option.selectors)}`}</Text>
            ))}
          </Box>
          {event.type === "change" && (
            <Text>Changed content: {event.data}</Text>
          )}
          <Checkbox
            mt="sm"
            label="Create state"
            styles={stateCreateStyle}
            size="xs"
            checked={event.tag === "create_state"}
            onChange={handleChangeStateCheck}
            disabled={disableStateControl}
          />
        </Box>
      );
  }
  return <Text>N/A</Text>;
};

const stateCreateStyle = (theme: MantineTheme) => ({
  label: { color: theme.colors.gray[6] },
});
