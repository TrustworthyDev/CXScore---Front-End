import clsx from "clsx";
import { useContext } from "react";

import { Box } from "@/atoms/Box";
import { List } from "@/atoms/List";
import { Text } from "@/atoms/Text";
import { CircleDown } from "@/icons/CircleDown";
import { CircleUp } from "@/icons/CircleUp";

import { ValidationRow } from "./ValidationRow";
import ValidationStudioContext from "./ValidationStudioContext";

type ValidationRuleRowProps = ListRowElementProps<ValidationByRule>;

export const ValidationRuleRow: React.FC<ValidationRuleRowProps> = ({
  row: ruleRow,
}) => {
  const {
    activeItem: { activeRule },
    setActiveItem,
  } = useContext(ValidationStudioContext);

  const handleClickRow = () => {
    setActiveItem &&
      setActiveItem({
        activeValidation: "",
        activeRule: activeRule === ruleRow.ruleId ? "" : ruleRow.ruleId,
      });
  };

  return (
    <Box key={`ruleRow-${ruleRow.ruleId}`}>
      <Box flex className="items-center">
        <Box className="cursor-pointer p-2" onClick={handleClickRow}>
          {activeRule !== ruleRow.ruleId ? <CircleDown /> : <CircleUp />}
        </Box>
        <Box>
          <Text variant="h3" className="inline text-black">
            {`Success Criteria: ${
              ruleRow.rule?.detailSuccessCriteria || ruleRow.rule?.name || ""
            }`}
          </Text>
          <Text
            variant="h3"
            className="ml-1 inline text-red-600"
          >{`[${ruleRow.validations.length}]`}</Text>
          <Text
            variant="h3"
            className="ml-1 inline font-bold text-red-600"
          >{`[${ruleRow.rule?.detailLevel || ""}]`}</Text>
        </Box>
      </Box>
      {activeRule === ruleRow.ruleId && (
        <Box className={clsx("animate-[fadeIn_400ms_ease-in-out]")}>
          <List data={ruleRow.validations} RowElement={ValidationRow} />
        </Box>
      )}
    </Box>
  );
};
