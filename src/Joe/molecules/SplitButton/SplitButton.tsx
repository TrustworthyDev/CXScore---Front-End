import { Box } from "@/atoms/Box";
import { Button, ButtonProps } from "@/atoms/Button";
import { CircleDown } from "@/icons/CircleDown";
import React from "react";
import clsx from "clsx";

export type SplitButtonProps = ButtonProps & {
  onClickList: () => void;
  listText: string;
  buttonStyle?: string;
};

export const SplitButton: React.FC<SplitButtonProps> = ({
  children,
  listText,
  onClickList,
  buttonStyle,
  ...btnProps
}) => {
  const handleClickDown = () => {};
  return (
    <Box className={clsx("relative flex")}>
      <Box flex>
        <Button className={buttonStyle}>{children}</Button>
        <Box
          flex
          className="items-center justify-center cursor-pointer"
          onClick={handleClickDown}
        >
          <CircleDown />
        </Box>
      </Box>
      <span className="absolute flex flex-col">
        <Box className="h-0 w-0 border-[30px] border-t-0 border-red-500 border-b-black" />
      </span>
    </Box>
  );
};
