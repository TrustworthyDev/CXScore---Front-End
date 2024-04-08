import React from "react";
import clsx from "clsx";
import { Box } from "../Box";

export type ToggleProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  variant?: "small" | "medium" | "large";
  boxProps?: React.HTMLAttributes<HTMLDivElement>;
};

const ToggleConfig = {
  small:
    "mt-[0.3rem] h-3.5 w-8 before:h-3.5 before:w-3.5 after:-mt-[0.1875rem] \
            after:h-5 after:w-5 checked:after:-mt-[0.1875rem] checked:after:ml-[1.0625rem] \
            checked:after:h-5 checked:after:w-5 focus:after:h-5 focus:after:w-5",
  medium:
    "mt-[0.5rem] h-4 w-11 before:h-4 before:w-4 after:-mt-[0.25rem] \
            after:h-6 after:w-6 checked:after:-mt-[0.25rem] checked:after:ml-[1.5rem] \
            checked:after:h-6 checked:after:w-6  focus:after:h-6 focus:after:w-6",
  large:
    "h-3.5 w-8 before:h-3.5 before:w-3.5 after:-mt-[0.1875rem] \
            after:h-5 after:w-5 checked:after:-mt-[3px] checked:after:ml-[1.0625rem] \
            checked:after:h-5 checked:after:w-5  focus:after:h-5 focus:after:w-5",
};

export const Toggle: React.FC<ToggleProps> = ({
  className,
  variant = "small",
  boxProps,
  ...props
}) => {
  return (
    <Box className="relative p-2" {...boxProps}>
      <input
        className={clsx(
          `checked:focus:border-primary appearance-none rounded-full bg-[rgba(0,0,0,0.25)] 
outline-none before:pointer-events-none before:absolute before:rounded-full
before:bg-transparent before:content-[''] after:absolute after:z-[2] 
after:rounded-full after:border-none after:bg-white           
after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)]           
after:transition-[background-color_0.2s,transform_0.2s] after:content-['']           
checked:bg-primary checked:after:absolute checked:after:z-[2]           
checked:after:rounded-full checked:after:border-none checked:after:bg-primary           
checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)]           
checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-['']           
hover:cursor-pointer focus:before:scale-100 focus:before:opacity-[0.12]           
focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s]           
focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5           
focus:after:rounded-full focus:after:content-[''] checked:focus:bg-primary checked:focus:before:ml-[1.0625rem]           
checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]          
 checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s]`,
          ToggleConfig[variant],
          className
        )}
        type="checkbox"
        role="switch"
        id="flexSwitchCheckDefault"
        {...props}
      />
    </Box>
  );
};
