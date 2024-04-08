export type CheckBoxProps = {} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const CheckBox: React.FC<CheckBoxProps> = ({ ...checkBoxProps }) => {
  return <input type="checkbox" {...checkBoxProps} />;
};
