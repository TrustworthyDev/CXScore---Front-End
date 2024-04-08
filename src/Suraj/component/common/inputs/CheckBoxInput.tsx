import React from "react";
import clsx from "clsx";
import HeadingTwo from "../headings/HeadingTwo";

interface CheckBoxInputProps {
  containerClassName?: string;
  className?: string; // this is actually the className of the text
  text: string;
  checked: boolean;
  disabled?: boolean;
  handleClick?: () => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>; // without this the checkbox is read-only
}

const CheckBoxInput: React.FC<CheckBoxInputProps> = ({
  containerClassName,
  className,
  text,
  checked,
  disabled,
  handleClick,
  onChange,
}) => {
  return (
    <div className={clsx("flex items-center pb-3", containerClassName)}>
      <div className="pr-2">
        <input
          type="checkbox"
          checked={checked}
          onClick={handleClick}
          disabled={disabled}
          onChange={onChange}
        />
      </div>
      <HeadingTwo className={clsx("text-[#545454]", className)} text={text} />
    </div>
  );
};

export default CheckBoxInput;
