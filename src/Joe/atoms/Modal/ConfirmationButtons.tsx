import { Button } from "@mantine/core";
import React, { ReactElement, useCallback, useState } from "react";

type Props = {
  color?: string;
  confirmationLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  hideConfirmationButton?: boolean;
  confirmationDisabled?: boolean;
  hideCancelButton?: boolean;
  onCancel?: () => void;
  onClose: () => void;
  closeOnConfirm?: boolean;
  confirmOnEnterKeyPressed?: boolean;
  autoFocusConfirmButton?: boolean;
};

function ConfirmationButtons({
  onCancel,
  onClose,
  onConfirm,
  closeOnConfirm = true,
  hideConfirmationButton,
  confirmationDisabled,
  hideCancelButton,
  confirmationLabel,
  cancelLabel,
  color = "success",
}: // confirmOnEnterKeyPressed = true,
// autoFocusConfirmButton,
Props): ReactElement {
  const [isProcessing, setIsProcessing] = useState(false);
  const isButtonDisabled = confirmationDisabled || isProcessing;

  // TODO: refactor
  // state of confirmation button must reflect form state
  // currently both states are independent
  // update InputField and TextareaField afterwards
  const onConfirmClick = useCallback(async () => {
    setIsProcessing(true);
    try {
      await onConfirm?.();

      if (closeOnConfirm) {
        onClose();
      } else {
        setIsProcessing(false);
      }
    } catch {
      setIsProcessing(false);
    }
  }, [closeOnConfirm, onClose, onConfirm]);

  const onCancelClick = useCallback(() => {
    onCancel?.();
    onClose();
  }, [onCancel, onClose]);

  // useHotkeys("enter", onConfirmClick, [onConfirmClick], {
  //   enableForModal: true,
  //   disabled:
  //     isButtonDisabled ||
  //     hideConfirmationButton ||
  //     !confirmOnEnterKeyPressed ||
  //     !onConfirm,
  // });

  return (
    <>
      {!hideCancelButton && (
        <Button onClick={onCancelClick} color="secondary">
          {cancelLabel || "Cancel"}
        </Button>
      )}

      {!hideConfirmationButton && (
        <Button
          onClick={onConfirmClick}
          disabled={isButtonDisabled}
          loading={isProcessing}
          name="processing-button"
          ml="md"
          color={color === "success" ? "primary" : "accent"}
        >
          {confirmationLabel}
        </Button>
      )}
    </>
  );
}

export default ConfirmationButtons;
