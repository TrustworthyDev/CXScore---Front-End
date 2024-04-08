import React from "react";
import { Card } from "@/atoms/Card";
import { Text } from "@/atoms/Text";
import clsx from "clsx";
export type ButtonProps = {
  title: string;
  className?: string;
  rightElement?: React.ReactNode;
};

export const PageHeader: React.FC<ButtonProps> = ({
  title,
  className,
  rightElement,
}) => {
  return (
    <Card
      variant="full-rounded"
      className={clsx("bg-slate-100 py-2 px-5", className, {
        "flex items-center justify-between": !!rightElement,
      })}
    >
      <Text variant="h2" uppercase className="font-bold text-[#666666]">
        {title}
      </Text>
      {rightElement && <div>{rightElement}</div>}
    </Card>
  );
};
