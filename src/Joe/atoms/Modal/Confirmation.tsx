import React, { PropsWithChildren, ReactElement } from "react";
import { Text } from "@mantine/core";

import { Modal } from "./Modal";
import ConfirmationButtons from "./ConfirmationButtons";

export type ConfirmationProps = PropsWithChildren<{
  header: string | ReactElement;
  hideConfirmationButton?: boolean;
  confirmationLabel: string;
  onConfirm(): void;
  isOpen?: boolean;
  cancelLabel?: string;
  color?: string;
  confirmationDisabled?: boolean;
  onClose?(): void;
  closeOnDimmerClick?: boolean;
  closeOnEscape?: boolean;
  closeOnConfirm?: boolean;
  confirmOnEnterKeyPressed?: boolean;
  autoFocusConfirmButton?: boolean;
  hideCancelButton?: boolean;
}>;

function Confirmation({
  confirmationLabel,
  hideConfirmationButton,
  onConfirm,
  cancelLabel = "",
  color = "success",
  confirmationDisabled = false,
  closeOnConfirm = true,
  closeOnDimmerClick = true,
  onClose = () => {},
  confirmOnEnterKeyPressed = true,
  autoFocusConfirmButton = false,
  hideCancelButton = false,
  children,
  ...rest
}: ConfirmationProps): ReactElement {
  return (
    <Modal
      onClose={onClose}
      actionButtons={
        <ConfirmationButtons
          onClose={onClose}
          onConfirm={onConfirm}
          color={color}
          hideConfirmationButton={hideConfirmationButton}
          confirmationDisabled={confirmationDisabled}
          confirmationLabel={confirmationLabel}
          cancelLabel={cancelLabel}
          closeOnConfirm={closeOnConfirm}
          confirmOnEnterKeyPressed={confirmOnEnterKeyPressed}
          autoFocusConfirmButton={autoFocusConfirmButton}
          hideCancelButton={hideCancelButton}
        />
      }
      closeOnDimmerClick={closeOnDimmerClick}
      {...rest}
    >
      <Text py={4}>{children}</Text>
    </Modal>
  );
}

export default Confirmation;
