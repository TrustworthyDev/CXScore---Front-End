import React, { useContext } from "react";
import { Box } from "@/atoms/Box";
import { Button } from "@/atoms/Button";
import { Text } from "@/atoms/Text";
import ViolationDetailContext from "../ViolationDetailContext";
import { Card } from "@/atoms/Card";
import { Tooltip } from "@/atoms/Tooltip";
import clsx from "clsx";

export type CXSKeyboardAccessibleDetailComponentProps = {
  detailInfo: CXSKeyboardAccessibleDetail;
};

export const CXSKeyboardAccessibleDetailComponent: React.FC<
  CXSKeyboardAccessibleDetailComponentProps
> = ({ detailInfo }) => {
  const { setActiveIndex } = useContext(ViolationDetailContext);
  const handleClickBtn = (index: number) => {
    setActiveIndex && setActiveIndex(index);
  };

  return (
    <Box className="p-4">
      <Text variant="h2" className="text-black">{`Accessible Element`}</Text>
      <Tooltip
        message={
          <KeyboardAccessibleToolTip
            rectangle={detailInfo.output.rectangle}
            path={detailInfo.output.path}
            className="bg-pink-500"
          />
        }
      >
        <Button className="my-2 bg-pink-600" onClick={() => handleClickBtn(0)}>
          <Text>Element</Text>
        </Button>
      </Tooltip>
    </Box>
  );
};

export type KeyboardAccessibleToolTipProps = {
  rectangle: Rectangle;
  path: string;
  className?: string;
};

const KeyboardAccessibleToolTip: React.FC<KeyboardAccessibleToolTipProps> = ({
  rectangle,
  path,
  className,
}) => {
  return (
    <Card
      variant="full-rounded"
      className={clsx("max-w-[400px] p-3", className)}
    >
      <Text variant="h3" className="break-words font-bold">
        {path}
      </Text>
      <Text variant="small" className="mt-4">
        {`(x: ${rectangle.x.toFixed(0)}, y: ${rectangle.y.toFixed(
          0
        )}, w: ${rectangle.w.toFixed(0)}, h: ${rectangle.h.toFixed(0)})`}
      </Text>
    </Card>
  );
};
