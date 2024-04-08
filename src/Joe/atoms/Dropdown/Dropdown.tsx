import { ReactChild, ReactElement, useMemo } from "react";
import ReactDropdown, {
  Group,
  Option,
  ReactDropdownProps,
} from "react-dropdown";
import "./style.css";

const NIL_OPTION = "nil";

type DropdownProps = {
  placeholder?: string;
  required?: boolean;
  fullWidth?: boolean;
  submitOnChanges?: boolean;
  /** The value will be parsed as number before being set in Formik */
  asNumber?: boolean;
  optional?: boolean;
  nullable?: boolean;
} & ReactDropdownProps;

export const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && !Array.isArray(value) && value !== null;
};

export const isOption = (option: string | Group | Option): option is Option => {
  return isObject(option) && "value" in option;
};

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  placeholder = "Select an option",
  submitOnChanges,
  fullWidth,
  asNumber,
  optional,
  nullable,
  ...props
}) => {
  const supportsNil = optional || nullable;
  const finalOptions = useMemo(
    () =>
      supportsNil
        ? [{ value: NIL_OPTION, label: "None" }, ...options]
        : options,
    [supportsNil, options]
  );

  return (
    <ReactDropdown
      {...props}
      options={finalOptions}
      placeholder={placeholder}
    />
  );
};
