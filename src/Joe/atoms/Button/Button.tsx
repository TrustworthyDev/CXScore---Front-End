import React from "react";
import { BasicButton, BasicButtonProps } from "../BasicButton";

export type ButtonProps = BasicButtonProps;

export const Button: React.FC<ButtonProps> = ({
  children,
  ...basicBtnProps
}) => {
  return <BasicButton {...basicBtnProps}>{children}</BasicButton>;
};
