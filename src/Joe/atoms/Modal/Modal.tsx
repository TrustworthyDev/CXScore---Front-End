import { CircleClose } from "@/icons/CircleClose";
import clsx from "clsx";
import FocusTrap from "focus-trap-react";
import {
  MouseEvent,
  PropsWithChildren,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
} from "react";
import ReactDOM from "react-dom";
import { Box } from "../Box";
import { Flex } from "../Flex";
import ModalFooter from "./ModalFooter";

type onCloseFn = () => void;
const noop = (): void => void {};

export type ModalProps = PropsWithChildren<{
  isOpen?: boolean;
  onClose: onCloseFn;
  header: string | ReactElement;
  smallHeader?: boolean;
  actionButtons?: ReactElement | null;
  closeOnEscape?: boolean;
  closeOnDimmerClick?: boolean;
  additionalHeaderElements?: ReactElement | null;
  large?: boolean;
  disableAutoFocus?: boolean;
  modalContentStyle?: string;
}>;

export type TemplateProps<P = JSX.IntrinsicAttributes> = P & {
  modalProps: {
    isOpen: boolean;
    onClose(): void;
  };
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose = noop,
  children,
  header,
  actionButtons,
  closeOnDimmerClick,
  additionalHeaderElements,
  disableAutoFocus,
  modalContentStyle,
}) => {
  const isDrag = useRef(false);
  const isPointerDown = useRef(false);
  const modalBodyRef = useRef<HTMLDivElement>(null);

  // useHotkeys("esc", onClose, [onClose], {
  //   enableForModal: true,
  //   enableForInputs: true,
  //   disabled: !closeOnEscape || !isOpen,
  // });

  const modalRoot = document.getElementById("modal-root");

  useEffect(() => {
    // Ensure body scrolling is disabled when modal is open
    // Important - this should not overwrite the class used by the canvas
    const { classList } = document.body;
    isOpen
      ? classList.add("overflow-hidden")
      : classList.remove("overflow-hidden");

    // Remove body scrolling lock when modal is unmounted
    return () => {
      classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  const onDimmerPointerDown = useCallback(() => {
    isDrag.current = false;
    isPointerDown.current = true;
  }, []);

  const onDimmerPointerMove = useCallback(() => {
    isDrag.current = isPointerDown.current;
  }, []);

  const onDimmerPointerUp = useCallback(() => {
    isPointerDown.current = false;
  }, []);

  const onDimmerClick = useCallback(
    (e: MouseEvent) => {
      if (modalBodyRef.current?.contains(e.target as Node)) {
        return;
      }
      if (closeOnDimmerClick && !isDrag) {
        onClose();
      }
    },
    [closeOnDimmerClick, onClose]
  );

  if (!modalRoot || !isOpen) {
    return null;
  }

  const component = (
    <FocusTrap
      active={!disableAutoFocus}
      focusTrapOptions={{
        allowOutsideClick: () => true,
        fallbackFocus: () => document.body,
      }}
    >
      <Flex
        className="fixed top-0 left-0 z-[100000] h-full w-full items-center bg-white/80"
        onClick={onDimmerClick}
        onPointerDown={onDimmerPointerDown}
        onPointerMove={onDimmerPointerMove}
        onPointerUp={onDimmerPointerUp}
        aria-modal
        role="dialog"
      >
        <Flex
          className={clsx(
            "my-0 mx-auto max-h-[95%] flex-col border border-gray-300 bg-white shadow-xl",
            modalContentStyle
          )}
          ref={modalBodyRef}
        >
          {/* content needs to go before header, so that it has priority in taking focus before the Close button */}
          <Box className={clsx("relative order-2 flex-1 overflow-auto p-8")}>
            <Box>{children}</Box>
          </Box>
          <Flex className="order-1 p-4">
            <Flex className="flex-1 items-center justify-between pb-2">
              <Flex className="justify-between">
                {header}
                {additionalHeaderElements}
              </Flex>

              <Box className="cursor-pointer" onClick={onClose}>
                <CircleClose size={24} />
              </Box>
            </Flex>
          </Flex>
          <ModalFooter>{actionButtons}</ModalFooter>
        </Flex>
      </Flex>
    </FocusTrap>
  );

  return ReactDOM.createPortal(component, modalRoot);
};
