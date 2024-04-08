import React, { useContext } from "react";
import { Box } from "@/atoms/Box";
import { Button } from "@/atoms/Button";
import { Text } from "@/atoms/Text";
import ViolationDetailContext from "../ViolationDetailContext";
import { Card } from "@/atoms/Card";
import { Tooltip } from "@/atoms/Tooltip";
import clsx from "clsx";

export type CXSKeyboardTrapDetailComponentProps = {
  detailInfo: CXSKeyboardTrapDetail;
};

export const CXSKeyboardTrapDetailComponent: React.FC<
  CXSKeyboardTrapDetailComponentProps
> = ({ detailInfo }) => {
  const { setActiveIndex } = useContext(ViolationDetailContext);
  const handleClickBtn = (index: number) => {
    setActiveIndex && setActiveIndex(index);
  };

  return (
    <Box className="w-full p-4">
      <Text
        variant="h2"
        className="text-black"
      >{`Keyboard Trap Elements Cycle`}</Text>
      <Box className="h-full overflow-auto">
        {detailInfo.output.map(({ index, path_rectangle }, eleInd) => (
          <Tooltip
            key={`src-key-${index}`}
            message={
              <KeyboardTrapToolTip
                rectangle={path_rectangle.rectangle}
                path={path_rectangle.path}
                className="bg-pink-500"
              />
            }
          >
            <Button
              className="my-2 bg-pink-600"
              onClick={() => handleClickBtn(eleInd)}
            >
              <Text>{index}</Text>
            </Button>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};

export type KeyboardTrapToolTipProps = {
  rectangle: Rectangle;
  path: string;
  className?: string;
};

const KeyboardTrapToolTip: React.FC<KeyboardTrapToolTipProps> = ({
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
