import React from "react";
import clsx from "clsx";
import BaseHeading from "./BaseHeading";

interface HeadingOneProps {
  text: string | number | undefined;
  className?: string;
}

const HeadingOne: React.FC<HeadingOneProps> = ({ text, className }) => {
  return <BaseHeading className={clsx("text-2xl", className)} text={text} />;
};

export default HeadingOne;
