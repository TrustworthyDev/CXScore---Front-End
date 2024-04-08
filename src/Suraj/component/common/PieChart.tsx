import { ResponsivePie } from "@nivo/pie";
import { calculatePercentage } from "../../utils/utils";
import React from "react";

const defaultColor = "hsl(0, 0%, 87%)";

export function prepareData(data: any): any {
  const initialValue = 0;
  const valueTotal = data?.datasets[0]?.data.reduce(
    (accumulator: number, currentValue: number) => accumulator + currentValue,
    initialValue
  );
  let filteredData: { label: any; oldIndex: any; abbreviation: any }[] = [];
  for (let i = 0; i < data?.labels?.length; i++) {
    if (data?.datasets[0].data[i] !== 0) {
      filteredData.push({
        label: data?.labels[i].label,
        abbreviation: data?.labels[i].abbreviation,
        oldIndex: i,
      });
    }
  }
  return filteredData.map((item: any) => {
    const { label, abbreviation, oldIndex } = item;
    return {
      id: label,
      label,
      abbreviation,
      value: data?.datasets[0].data[oldIndex],
      color: data?.datasets[0].backgroundColor[oldIndex],
      index: oldIndex,
      total: valueTotal,
    };
  });
}

export function handleColor(
  data: any,
  fieldKey: any,
  checkedFilterVals: any,
  violationsFilters: any
): any {
  const filterKey = Object.keys(violationsFilters[fieldKey])[data?.index];
  return checkedFilterVals[filterKey] ? data?.color : defaultColor;
}

export function handleClickPieChart(
  element: any,
  event: any,
  fieldKey: any,
  checkedFilterVals: any,
  handleChangeCheckFilters: any,
  violationsFilters: any
): any {
  const filterKey = Object.keys(violationsFilters[fieldKey])[
    element?.data?.index
  ];
  // @ts-ignore
  handleChangeCheckFilters(filterKey, !checkedFilterVals[filterKey]);
}

const PieChart = (props: {
  width: string;
  height: string;
  data: any;
  handlePieClick: any;
  handleColor: any;
}) => {
  return (
    <>
      {props.data.length ? (
        <div style={{ width: props.width, height: props.height }}>
          <ResponsivePie
            data={props.data}
            onClick={(element, event) => {
              props.handlePieClick(element, event);
            }}
            colors={({ data }) => {
              return props.handleColor(data);
            }}
            margin={{ top: 20, right: 40, bottom: 20, left: 40 }}
            innerRadius={0}
            padAngle={0}
            cornerRadius={2}
            activeOuterRadiusOffset={3}
            borderWidth={1}
            borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
            arcLinkLabelsSkipAngle={15}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsTextOffset={5}
            arcLinkLabelsStraightLength={7}
            arcLinkLabel={(e) => {
              // @ts-ignore
              return `${e.data.id} (${e.value})`;
            }}
            arcLinkLabelsColor={{ from: "color" }}
            arcLinkLabelsDiagonalLength={7}
            arcLabelsSkipAngle={20}
            arcLabelsTextColor={"#fff"}
            arcLabel={(e) => {
              // @ts-ignore
              return `${calculatePercentage(e.value, e.data.total)}%`;
            }}
            arcLabelsRadiusOffset={0.5}
            tooltip={(e) => {
              // @ts-ignore
              const total = e.datum.data.total;
              return (
                <div
                  style={{
                    padding: 6,
                    color: e.datum.color,
                    background: "#222222",
                    display: "flex",
                    justifyItems: "center",
                    borderRadius: 5,
                  }}
                >
                  <br />
                  <strong>
                    {e.datum.id}: {e.datum.value}(
                    {calculatePercentage(e.datum.value, total)}%)
                  </strong>
                </div>
              );
            }}
            theme={{ fontSize: 11 }}
          />
        </div>
      ) : (
        <div className="flex flex-col">
          <div style={{ width: props.width, height: props.height }}>
            {" "}
            <ResponsivePie
              data={[
                {
                  id: "All Done",
                  label: "All Done",
                  value: 100,
                  color: defaultColor,
                },
              ]}
              colors={defaultColor}
              margin={{ top: 20, right: 20, bottom: 20, left: 30 }}
              innerRadius={0}
              enableArcLabels={false}
              enableArcLinkLabels={false}
              tooltip={() => {
                return null;
              }}
            />
          </div>
          <div className="text-center">No Violations Found</div>
        </div>
      )}
    </>
  );
};

export default PieChart;
