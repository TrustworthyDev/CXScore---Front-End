import { useCallback, useMemo, useState } from "react";

const noop = (): void => void {};

export type ModalStateProps<T = undefined> = {
  onConfirm(): void;
  isOpen: boolean;
  data?: T;
  onClose(): void;
};

type UseModalState<T> = {
  open(openProps?: OpenProps<T>): void;
  close(): void;
  props: ModalStateProps<T>;
};

type OpenProps<T> = {
  data?: T;
  confirmCallback?(): void;
  closeCallback?(): void;
};

export const useConfirmModal = <T = undefined>(): UseModalState<T> => {
  const [isOpen, setIsOpen] = useState(false);
  const [onConfirm, setConfirmCallback] = useState(() => noop);
  const [onClose, setCloseCallback] = useState(() => noop);
  const [modalData, setModalData] = useState<T | undefined>();

  const open = useCallback((openProps: OpenProps<T> | undefined) => {
    const { data, closeCallback, confirmCallback } = openProps || {};
    setIsOpen(true);
    setConfirmCallback(() => confirmCallback || noop);
    setCloseCallback(() => closeCallback || noop);
    setModalData(data);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const onModalClose = useCallback(() => {
    close();
    onClose();
  }, [close, onClose]);

  return useMemo(
    () => ({
      open,
      close,
      props: {
        onConfirm,
        isOpen,
        data: modalData,
        onClose: onModalClose,
      },
    }),
    [close, isOpen, modalData, onConfirm, onModalClose, open]
  );
};
