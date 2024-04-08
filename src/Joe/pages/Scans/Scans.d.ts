type ScansPageContextData = {
  refetchScans?: () => void;
  setIsConfirmOpen?: (val: boolean) => void;
  setConfirmModalProps?: (modalProps: {
    content: string;
    onClickButton: (id: string) => void;
  }) => void;
};
