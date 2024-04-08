import React, { useContext } from "react";
import { Box } from "@/atoms/Box";
import { Button } from "@/atoms/Button";
import { Text } from "@/atoms/Text";
import ViolationDetailContext from "../ViolationDetailContext";
import { Card } from "@/atoms/Card";
import { Tooltip } from "@/atoms/Tooltip";
import clsx from "clsx";

export type CXSFocusOrderDetailComponentProps = {
  detailInfo: CXSFocusOrderDetail;
};

export const CXSFocusOrderDetailComponent: React.FC<
  CXSFocusOrderDetailComponentProps
> = ({ detailInfo }) => {
  const { setActiveIndex } = useContext(ViolationDetailContext);
  const handleClickBtn = (category: "src" | "dst") => {
    if (category === "src") {
      setActiveIndex && setActiveIndex(0);
    } else {
      setActiveIndex && setActiveIndex(1);
    }
  };

  return (
    <Box className="p-4">
      <Box className="my-4">
        <Tooltip
          message={
            <FocusOrderToolTip
              rectangle={detailInfo.output.source.rectangle}
              path={detailInfo.output.source.path}
              className="bg-green-500"
            />
          }
          className="my-2"
        >
          <Button
            className="bg-green-600"
            onClick={() => handleClickBtn("src")}
          >
            <Text>Source</Text>
          </Button>
        </Tooltip>
      </Box>
      <Box className="my-4">
        <Tooltip
          message={
            <FocusOrderToolTip
              rectangle={detailInfo.output.destination.rectangle}
              path={detailInfo.output.destination.path}
              className="bg-blue-500"
            />
          }
          className="my-2"
        >
          <Button className="bg-blue-600" onClick={() => handleClickBtn("dst")}>
            <Text>Destination</Text>
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );
};

export type FocusOrderToolTipProps = {
  rectangle: Rectangle;
  path: string;
  className?: string;
};

const FocusOrderToolTip: React.FC<FocusOrderToolTipProps> = ({
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
