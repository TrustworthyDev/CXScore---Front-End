import { TextInput } from "@mantine/core";
import { Field, FieldProps } from "formik";
import React, { ReactElement } from "react";

type Props = {
  name: string;
  testId?: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  variant?: string;
  label?: string;
  processOnEnterPressed?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  readOnly?: boolean;
  disabled?: boolean;
  maxLength?: number;
  hideErrorMessage?: boolean;
};

type InputProps = Props & FieldProps;

function InputField({
  // form,
  meta,
  field,
  placeholder,
  label,
  // name,
  type,
  onChange,
  onBlur,
  disabled,
  autoComplete,
  maxLength,
  readOnly,
  hideErrorMessage,
}: InputProps): ReactElement {
  return (
    <TextInput
      placeholder={placeholder}
      autoComplete={autoComplete}
      label={label}
      type={type}
      disabled={disabled}
      maxLength={maxLength}
      readOnly={readOnly}
      {...field}
      onChange={onChange ?? field.onChange}
      onBlur={onBlur ?? field.onBlur}
      error={hideErrorMessage ? "" : meta.error}
    />
  );
}

function FormInputField(props: Props): ReactElement {
  return (
    <Field name={props.name}>
      {(fieldProps: FieldProps) => <InputField {...props} {...fieldProps} />}
    </Field>
  );
}

export default FormInputField;
