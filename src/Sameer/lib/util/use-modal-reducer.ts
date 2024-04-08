import { useReducer } from "react";

type ModalProps = {
  showModal: boolean;
  content: string;
  onClickButton: (id: string) => void;
};

export type UseModalReducerAction = {
  type: "showModal" | "hideModal" | "updateModalProps";
  payload?: Partial<ModalProps>;
};

function modalReducer(state: ModalProps, action: UseModalReducerAction) {
  switch (action.type) {
    case "showModal":
      return { ...state, showModal: true };
    case "hideModal":
      return { ...state, showModal: false };
    case "updateModalProps":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export const useModalReducer = () => {
  const [modalProps, modalDispatch] = useReducer(modalReducer, {
    showModal: false,
    content: "",
    onClickButton: (id: string) => {},
  });

  return { modalProps, modalDispatch };
};
