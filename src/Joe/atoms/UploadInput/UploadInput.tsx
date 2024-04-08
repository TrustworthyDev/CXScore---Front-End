import React, { useEffect, useRef, useState } from "react";

import clsx from "clsx";

import { Box } from "@/atoms/Box";
import { VerticalSeparator } from "../../../Sameer/components/atoms/seperator/vertical-separator";
import { SearchIcon } from "@/icons/Search";
import { UploadIcon } from "@/icons/Upload";
import { CircleClose } from "@/icons/CircleClose";

type UploadInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  onChangeFile?: (val: File | undefined) => void;
};

export const UploadInput: React.FC<UploadInputProps> = ({
  disabled,
  className,
  value,
  onChangeFile,
  ...inputProps
}) => {
  const [file, setFile] = useState<File>();
  const inputRef = useRef<HTMLInputElement>(null);
  const handleClickUpload = () => {
    inputRef.current?.click();
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    setFile(e.target.files[0]);
    onChangeFile && onChangeFile(e.target.files[0]);
  };

  const handleRemoveFile = () => {
    setFile(undefined);
    onChangeFile && onChangeFile(undefined);
    if (inputRef.current) {
      inputRef.current.value = ""; // Clear the file input value
      const event = new Event("input", { bubbles: true });
      inputRef.current.dispatchEvent(event);
    }
  };

  return (
    <div
      className={clsx(
        "flex items-center space-x-2 border border-gray-300 px-2 py-1.5",
        disabled ? "bg-gray-200" : "bg-white",
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        onChange={handleChangeFile}
        accept=".txt, .xml, .json"
        className="hidden"
      />
      <input
        type="text"
        value={file?.name || ""}
        className={clsx(
          "flex-grow px-2 placeholder:text-gray-400",
          disabled ? "bg-gray-200" : "bg-white"
        )}
        readOnly
        {...inputProps}
      />
      <VerticalSeparator />
      {file ? (
        <Box className="cursor-pointer" onClick={handleRemoveFile}>
          <CircleClose size={30} />
        </Box>
      ) : (
        <Box className="cursor-pointer" onClick={handleClickUpload}>
          <UploadIcon />
        </Box>
      )}
    </div>
  );
};
