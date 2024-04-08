import React from "react";

type BaseHeadingProps = {
  text: string | number | undefined;
  className?: string;
};

const BaseHeading: React.FC<BaseHeadingProps> = ({ text, className }) => {
  return <div className={className}>{text}</div>;
};

export default BaseHeading;
