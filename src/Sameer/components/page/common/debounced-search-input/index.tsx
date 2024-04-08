import React, { PropsWithChildren, useEffect, useState } from "react";

import { VerticalSeparator } from "../../../atoms/seperator/vertical-separator";
import clsx from "clsx";
import useThrottledValue from "../../../../lib/util/use-throttled-value";
import { SearchIcon } from "@/icons/Search";
import { useDebouncedValue } from "../../../../lib/util/use-debounced-value";
import { Box } from "@/atoms/Box";

interface ScanInputBarProps {
  className?: string;
  placeholder?: string;
  onChangeDebounced?: (value: string) => void;
  onChange?: (value: string) => void;
  debounceMs?: number;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  onClickSearch?: (value: string) => void;
  disabled?: boolean;
}

export const DebouncedSearchInput = (
  props: PropsWithChildren<ScanInputBarProps>
) => {
  const [searchInput, setSearchInput] = useState("");

  const debouncedSearchInputValue = useDebouncedValue<string>(
    searchInput,
    props.debounceMs ?? 500
  );

  useEffect(() => props.onChange && props.onChange(searchInput), [searchInput]);

  useEffect(() => {
    props.onChangeDebounced &&
      props.onChangeDebounced(debouncedSearchInputValue);
  }, [debouncedSearchInputValue]);

  const handleClickSearchBtn = () => {
    props.onClickSearch &&
      !props.disabled &&
      props.onClickSearch(debouncedSearchInputValue);
  };

  return (
    <div
      className={clsx(
        "border-1 flex items-center space-x-2 border border-gray-300 px-2 py-1.5",
        props.disabled ? "bg-[#D3E2FB]" : "bg-white",
        props.className
      )}
    >
      <input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className={clsx(
          "flex-grow px-2 placeholder:text-gray-400 focus:outline-none",
          props.disabled ? "bg-[#D3E2FB]" : "bg-white"
        )}
        placeholder={props.placeholder}
        readOnly={props.disabled}
        {...props.inputProps}
      />
      <VerticalSeparator />
      <Box className="cursor-pointer" onClick={handleClickSearchBtn}>
        <SearchIcon role="presentation" />
      </Box>
    </div>
  );
};
