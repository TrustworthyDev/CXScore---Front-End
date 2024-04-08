import React, { useMemo } from "react";
import { BasicButton } from "@/atoms/BasicButton";
import { Box } from "@/atoms/Box";
import { Text } from "@/atoms/Text";
import clsx from "clsx";
import { Card } from "@/atoms/Card";
import { List } from "@/atoms/List";
import { Tooltip } from "@/atoms/Tooltip";
import { useSelector } from "react-redux";
import { selectGuidedRuleByIssueCnt } from "@/reduxStore/scan/guided/guided.reducer";
import { selectRuleMetaData } from "@/reduxStore/scan/rule/rule.reducer";

export type CriteriaListProps = {
  onClickViewAll: () => void;
  className?: string;
};

export const CriteriaList: React.FC<CriteriaListProps> = ({
  onClickViewAll,
  className,
}) => {
  const ruleByIssueCnt = useSelector(selectGuidedRuleByIssueCnt);
  const ruleMetaData = useSelector(selectRuleMetaData);

  const topCriteriaData = useMemo(() => {
    return [
      ...ruleByIssueCnt.slice(0, 10).map((item) => {
        const ruleInfo = ruleMetaData.find((rule) => rule.id === item.value);
        return {
          name: ruleInfo?.detailSuccessCriteria,
          description: ruleInfo?.description,
          issueCnt: item.count,
        };
      }),
      ...(ruleByIssueCnt.length < 10
        ? Array(10 - ruleByIssueCnt.length).fill(
            {
              name: "-",
              description: "",
              issueCnt: 0,
            },
            0,
            10
          )
        : []),
    ];
  }, [ruleByIssueCnt, ruleMetaData]);

  return (
    <Box
      flex
      flexDirection="col"
      className={clsx("justify-between", className)}
    >
      <BasicButton
        className="mb-3 h-14 self-end px-20 py-4"
        onClick={onClickViewAll}
      >
        View all Tests
      </BasicButton>
      <Box>
        <Box className="mb-4">
          <Text className="text-4xl font-bold text-black/60">TOP 10</Text>
        </Box>
        <Box className="mb-11">
          <Text variant="h2" className="text-black/60">
            Manual Tests by Success Criteria
          </Text>
        </Box>
        <Card
          noBorder
          className="mb-2 rounded-br-3xl bg-slate-200/[0.17] px-6 py-3.5"
        >
          <Box flex className="w-full">
            <Text variant="small" className="flex-[7] text-black/70">
              Success Criteria
            </Text>
            <Text
              variant="small"
              className="flex-[2] text-center text-black/70"
            >
              Issues
            </Text>
          </Box>
        </Card>
        <Card
          roundedBR
          dropShadow
          noBorder
          className="rounded-br-3xl bg-white/[0.17]"
        >
          <List
            data={topCriteriaData}
            renderRow={(row, ind) => (
              <Box
                flex
                className="border-b border-black/50 p-6 last:border-0"
                key={`key-${row.name}-${ind}`}
              >
                <Tooltip
                  message={
                    row.description !== "" ? (
                      <Card
                        variant="half-rounded"
                        className="max-w-[600px] bg-sky-100 pt-3 pb-6"
                      >
                        <Text
                          variant="small"
                          className="ml-2.5 font-bold text-black"
                        >
                          {row.name}
                        </Text>
                        <Text variant="small" className="mx-10 mt-4 text-black">
                          {row.description}
                        </Text>
                      </Card>
                    ) : (
                      <></>
                    )
                  }
                  className="flex-[7]"
                >
                  <Text
                    variant="small"
                    className="cursor-pointer font-semibold text-sky-500"
                  >
                    {row.name}
                  </Text>
                </Tooltip>
                <Text className="flex-[2] text-center text-black/70">
                  {row.issueCnt === 0
                    ? "-"
                    : row.issueCnt >= 10
                    ? row.issueCnt
                    : "0" + row.issueCnt}
                </Text>
              </Box>
            )}
          />
        </Card>
      </Box>
    </Box>
  );
};
