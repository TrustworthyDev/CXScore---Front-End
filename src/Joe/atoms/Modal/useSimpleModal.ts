import { useCallback, useMemo, useState } from "react";

export type ModalProps = {
  isOpen: boolean;
  open: () => void;
  onClose: () => void;
  close: () => void;
};

export const useSimpleModal = ({
  onClose: onCloseCallback,
}: { onClose?: () => void } = {}): ModalProps => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    onCloseCallback && onCloseCallback();
  }, [onCloseCallback]);

  return useMemo(
    () => ({
      isOpen,
      open,
      // Called `onClose` so that the object can be used for <ModalTemplate modalProps={modalProps} />
      onClose: close,
      close,
    }),
    [isOpen, open, close]
  );
};
