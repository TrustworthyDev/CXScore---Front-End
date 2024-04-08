import clsx from "clsx";
import React from "react";
import { Box, BoxProps } from "../Box";
import { Text } from "../Text";
import { TextInput, TextInputProps } from "../TextInput";

export type FormInputProps = {
  mandatory?: boolean;
  label: string;
  errorText?: string;
} & TextInputProps;

export const FormInput: React.FC<FormInputProps> = ({
  mandatory,
  label,
  className,
  errorText = "",
  ...inputProps
}) => {
  return (
    <Box className={clsx("flex w-full items-center", className)}>
      <Text
        variant="h3"
        className={clsx(
          "mr-7 w-40 text-right text-black",
          errorText !== "" && "text-[#DA7878]"
        )}
      >
        {`${mandatory && "* "}${label}`}
      </Text>
      <TextInput
        className={clsx(
          "flex-1",
          errorText !== "" && "bg-[#DA7878] text-white"
        )}
        {...inputProps}
      />
    </Box>
  );
};
