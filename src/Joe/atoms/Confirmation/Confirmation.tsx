import React, { useEffect, useRef, useState } from "react";
import { Box } from "../Box";
import { Text } from "../Text";
import { Card } from "../Card";
import { Button } from "../Button";
import clsx from "clsx";
import { CircleClose } from "@/icons/CircleClose";

export type ConfirmationButtonConfig = ActionButtonConfig & {
  buttonStyle: "warning" | "success";
};

export type ConfirmationProps = {
  isOpen?: boolean;
  onRequestClose?: () => void;
  title: string;
  content: string;
  buttonList?: ConfirmationButtonConfig[];
  onClickButton?: (buttonId: string) => Promise<void> | void;
};

export const Confirmation: React.FC<ConfirmationProps> = ({
  isOpen = false,
  title,
  content,
  buttonList = [],
  onClickButton,
  onRequestClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<string>();
  const handleClickBtn = async (buttonId: string) => {
    if (onClickButton) {
      setLoading(buttonId);
      await onClickButton(buttonId);
      setLoading(undefined);
    }
  };

  const handleClickClose = () => {
    onRequestClose && onRequestClose();
  };

  useEffect(() => {
    if (!containerRef.current || !isOpen) {
      return;
    }
    const focusableElements =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const firstFocusableElement =
      containerRef.current.querySelectorAll(focusableElements)[0]; // get first element to be focused inside modal
    const focusableContent =
      containerRef.current.querySelectorAll(focusableElements);
    const lastFocusableElement = focusableContent[focusableContent.length - 1]; // get last element to be focused inside modal

    const keydownListener = (e: KeyboardEvent) => {
      const isTabPressed = e.key === "Tab" || e.keyCode === 9;

      if (!isTabPressed) {
        return;
      }
      let isContained = false;
      focusableContent.forEach(
        (ele) => (isContained = isContained || ele === e.target)
      );
      if (e.shiftKey) {
        // if shift key pressed for shift + tab combination
        if (!isContained || document.activeElement === firstFocusableElement) {
          (lastFocusableElement as HTMLElement).focus(); // add focus for the last focusable element
          e.preventDefault();
        }
      } else {
        // if tab key is pressed
        if (!isContained || document.activeElement === lastFocusableElement) {
          // if focused has reached to last focusable element then focus first focusable element after pressing tab
          (firstFocusableElement as HTMLElement).focus(); // add focus for the first focusable element
          e.preventDefault();
        }
      }
    };

    document.addEventListener("keydown", keydownListener);

    (firstFocusableElement as HTMLElement).focus();
    return () => document.removeEventListener("keydown", keydownListener);
  }, [isOpen]);

  // useOnClickOutside(containerRef, () => {
  //   onRequestClose && onRequestClose();
  // });

  // useKeydown("Escape", () => {
  //   onRequestClose && onRequestClose();
  // });

  // useEffect(() => {
  //   if (isOpen) {
  //     focus();
  //   }
  // }, [isOpen]);

  if (!isOpen) {
    return <></>;
  }

  return (
    <>
      <Box
        flex
        className="fixed inset-0 z-[1500] items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none"
      >
        <Box
          className="relative my-6 mx-auto w-auto max-w-3xl"
          ref={containerRef}
        >
          <Card
            variant="full-rounded"
            dropShadow
            noBorder
            flex
            flexDirection="col"
            className="relative flex w-[28rem] flex-col bg-white outline-none focus:outline-none"
          >
            <Box flex className="items-center justify-between p-6">
              <Text variant="h2" className="font-semibold text-[#696969]">
                {title}
              </Text>
              <button
                aria-label="Exit this modal"
                className="cursor-pointer"
                onClick={handleClickClose}
              >
                <CircleClose size={24} aria-label="Exit this modal" />
              </button>
            </Box>
            <Box className="px-7">
              <Text variant="h3" className="text-[#696969]">
                {content}
              </Text>
              <Box className="my-9">
                {buttonList.map(({ buttonId, buttonText, buttonStyle }) => (
                  <Button
                    rounded
                    key={`confirmation-action-${buttonId}`}
                    className={clsx(
                      "my-2.5 w-full py-3",
                      buttonStyle === "warning"
                        ? "bg-[#E26666]"
                        : "bg-[#4EBCFA]"
                    )}
                    onClick={() => handleClickBtn(buttonId)}
                    loading={loading === buttonId}
                    disabled={!!loading}
                  >
                    <Text className="font-semibold">{buttonText}</Text>
                  </Button>
                ))}
              </Box>
            </Box>
          </Card>
        </Box>
      </Box>
      <Box className="fixed inset-0 z-[1400] bg-black opacity-25 " />
    </>
  );
};
