import { ScrollArea, Stepper } from "@mantine/core";
import React, { useCallback, useEffect, useRef } from "react";
import { EventDescription } from "./EventDescription";

type EventSequenceProps = {
  eventSequence: BrowserEvent[];
  enableNextEventSelect?: boolean;
  activeIndex?: number;
  onSetState?: (index: number, checked: boolean) => void;
};

export const EventSequence: React.FC<EventSequenceProps> = ({
  eventSequence,
  enableNextEventSelect = true,
  activeIndex = -1,
  onSetState,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the active step
    // First get active stepper reference
    const activeStepRef = scrollRef.current?.querySelector(
      '[data-progress="true"]'
    );
    //Scroll to the active step with this reference
    activeStepRef?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }, [activeIndex]);

  const handleChangeStateCheck = (index: number, checked: boolean) => {
    onSetState?.(index, checked);
  };

  const getEventLabel = useCallback((event: BrowserEvent) => {
    switch (event.type) {
      case "click":
        return "Click";
      case "change":
        return "Input Change";
      default:
        return "Navigate";
    }
  }, []);

  return (
    <ScrollArea
      style={{ width: "100%" }}
      p="md"
      viewportRef={scrollRef}
      type="always"
    >
      <Stepper
        active={activeIndex}
        orientation="vertical"
        allowNextStepsSelect={enableNextEventSelect}
      >
        {eventSequence.map((event, index) => (
          <Stepper.Step
            key={`${event.type}-${index}`}
            label={getEventLabel(event)}
            description={
              <EventDescription
                event={event}
                disableStateControl={activeIndex !== -1}
                onSetState={(checked: boolean) =>
                  handleChangeStateCheck(index, checked)
                }
              />
            }
            loading={index === activeIndex}
          />
        ))}
      </Stepper>
    </ScrollArea>
  );
};
