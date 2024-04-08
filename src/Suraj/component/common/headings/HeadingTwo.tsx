import React from "react";
import clsx from "clsx";
import BaseHeading from "./BaseHeading";

interface HeadingTwoProps {
  text: string | number;
  className?: string;
}

const HeadingTwo: React.FC<HeadingTwoProps> = ({ text, className }) => {
  return <BaseHeading className={clsx("text-lg", className)} text={text} />;
};

export default HeadingTwo;
