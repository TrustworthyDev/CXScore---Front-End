import { Close } from "@/icons/Close";
import clsx from "clsx";
import React, { useState } from "react";

interface PopupModalProps {
  children: React.ReactNode;
  openButton: React.ReactNode;
  closeButton: React.ReactNode;
  header?: React.ReactNode;
  headerClassName?: string;
  conformationButtons?: React.ReactNode;
}

const PopupModal: React.FC<PopupModalProps> = ({
  children,
  openButton,
  closeButton,
  header,
  headerClassName,
  conformationButtons,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      {openButton && <div onClick={openModal}>{openButton}</div>}
      {isOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative bg-white">
            <div className={clsx("px-4 py-4", headerClassName)}>{header}</div>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              <Close fill="#FFFFFF" />
            </button>
            <div className="mb-4">{children}</div>
            <div className="flex justify-end p-8">
              <div onClick={closeModal}>{conformationButtons}</div>
              {closeButton && <div onClick={closeModal}>{closeButton}</div>}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PopupModal;
