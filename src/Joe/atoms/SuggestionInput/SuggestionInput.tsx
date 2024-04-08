import clsx from "clsx";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Box, BoxProps } from "../Box";
import { Card } from "../Card";
import { Text } from "../Text";
import { TextInput, TextInputProps } from "../TextInput";
import { SearchIcon } from "@/icons/Search";
import { VerticalSeparator } from "../../../Sameer/components/atoms/seperator/vertical-separator";

export type SuggestionInputProps = {
  suggestions?: string[];
  classNames?: {
    textBox?: String;
    suggestionBox?: String;
    searchIcon?: { box: String };
  };
  onChangeText: (val: string) => void;
} & TextInputProps;

export const SuggestionInput: React.FC<SuggestionInputProps> = ({
  suggestions = [],
  onChangeText,
  classNames,
  ...inputProps
}) => {
  const [isShowSuggestion, setIsShowSuggestion] = useState(false);
  const selfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutSide = (event: MouseEvent) => {
      if (!selfRef.current?.contains(event.target as Node)) {
        setIsShowSuggestion(false);
      }
    };
    document.addEventListener("click", handleClickOutSide);
    return () => document.removeEventListener("click", handleClickOutSide);
  }, [selfRef]);

  const handleClickSuggestion = useCallback(
    (val: string) => {
      onChangeText && onChangeText(val);
      setIsShowSuggestion(false);
    },
    [onChangeText]
  );

  const suggestionList = useMemo(
    () =>
      suggestions.map((val) => (
        <Box
          key={`suggestion-${val}`}
          className="cursor-pointer p-2 hover:bg-gray-100"
          onClick={() => handleClickSuggestion(val)}
        >
          {val}
        </Box>
      )),
    [suggestions, handleClickSuggestion]
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setIsShowSuggestion(true);
      onChangeText && onChangeText(event.target.value);
    },
    [onChangeText]
  );

  return (
    <Box className="relative" ref={selfRef}>
      <div className="flex h-12 items-center">
        <TextInput
          onChange={handleChange}
          onFocus={() => setIsShowSuggestion(true)}
          {...inputProps}
          className={clsx(
            "h-full",
            classNames?.textBox ?? "w-full border border-gray-300 bg-white"
          )}
        />
        <div
          className={clsx(
            "flex h-full cursor-pointer items-center justify-center border border-black/10 px-3",
            classNames?.searchIcon?.box
          )}
        >
          <SearchIcon />
        </div>
      </div>

      {isShowSuggestion && suggestions.length > 0 && (
        <Card className="absolute left-0 z-50 w-full bg-white">
          {suggestionList}
        </Card>
      )}
    </Box>
  );
};
