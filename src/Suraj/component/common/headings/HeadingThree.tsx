import React from "react";
import clsx from "clsx";
import BaseHeading from "./BaseHeading";

type HeadingThreeProps = {
  text: string | number;
  className?: string;
};

const HeadingThree: React.FC<HeadingThreeProps> = ({ text, className }) => {
  return <BaseHeading className={clsx("text-sm", className)} text={text} />;
};

export default HeadingThree;
