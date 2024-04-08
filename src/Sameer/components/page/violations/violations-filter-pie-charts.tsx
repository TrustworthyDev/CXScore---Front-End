import { Pill } from "../../atoms/pill";
import FilterData from "../../../lookup/violations/possible-filters.json";
import { Loading } from "../../atoms/loading";
import { Skeleton } from "../../atoms/loading/skeleton";
import { useDispatch, useSelector } from "react-redux";

import {
  ViolationsFiltersGroupedByField,
  useViolationsCheckedFilterCount,
  useViolationsCountForPieChart,
} from "../../../lib/violations/count";
import {
  ViolationsActions,
  ViolationsSelectors,
} from "@/reduxStore/violations/violations";
import PieChart, {
  prepareData,
  handleClickPieChart,
  handleColor,
} from "../../../../Suraj/component/common/PieChart";
import "./violations.css";
import {
  selectA11yMode,
  selectFilterSidebarOpen,
} from "@/reduxStore/app/app.reducer";
import { onChangeFilterSidebarOpen } from "@/reduxStore/app/app.actions";

const checkedColor = "#3b82f6";
const uncheckedColor = "#bfdbfeb3";

const usePieChartData = (
  fieldKey: keyof typeof ViolationsFiltersGroupedByField
) => {
  const countQueryResult = useViolationsCheckedFilterCount();

  const checkedFilters = useSelector(ViolationsSelectors.selectCheckedFilters);

  const filter = ViolationsFiltersGroupedByField[fieldKey];

  // https://stackoverflow.com/questions/52856496/typescript-object-keys-return-string
  const filters = Object.keys(filter) as Array<keyof typeof FilterData>;

  const labels = filters.map((key) => {
    return {
      label: filter[key]?.label,
      abbreviation: filter[key]?.abbreviation,
    };
  });

  if (countQueryResult.isLoading || !countQueryResult.data) {
    return {
      ...countQueryResult,
      data: null,
    };
  }

  const data = filters.map((key) => countQueryResult.data[key] ?? { count: 0 });

  const backgroundColors = filters.map((key) =>
    checkedFilters[key]
      ? FilterData[key as keyof typeof FilterData].color ?? checkedColor
      : uncheckedColor
  );

  const borderColors = filters.map(() => "#ffffff");

  const first = FilterData[filters[0]];

  return {
    ...countQueryResult,
    data: {
      labels,
      datasets: [
        {
          label: first.fieldLabel,
          data: data.map((d) => d?.count ?? 0),
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 0.5,
        },
      ],
    },
  };
};

const ViolationPieChart = (props: {
  fieldKey: keyof typeof ViolationsFiltersGroupedByField;
}) => {
  const { fieldKey } = props;

  const { data, isLoading, error } = usePieChartData(fieldKey);

  const checkedFilterVals = useSelector(
    ViolationsSelectors.selectCheckedFilters
  );

  const dispatch = useDispatch();
  const handleChangeCheckFilters = (
    filter: keyof typeof FilterData,
    isChecked: boolean
  ) => {
    dispatch(
      ViolationsActions.CHANGE_VIOLATIONS_CHECK_FILTERS.action({
        filter,
        isChecked,
      })
    );
  };

  if (error || !data) {
    return null;
  }

  if (isLoading) {
    return <Loading />;
  }

  const first =
    FilterData[
      Object.keys(
        ViolationsFiltersGroupedByField[fieldKey]
      )[0] as keyof typeof FilterData
    ];
  return (
    <div className="testmanual flex min-w-[150px] flex-col place-content-center gap-2">
      <Pill className="overflow text-center font-body text-xs font-semibold">
        {/* Field Label */}
        <span>{first.fieldLabel}</span>
      </Pill>
      <PieChart
        width="220px"
        height="250px"
        data={prepareData(data)}
        handlePieClick={(element: object, event: object) => {
          handleClickPieChart(
            element,
            event,
            fieldKey,
            checkedFilterVals,
            handleChangeCheckFilters,
            ViolationsFiltersGroupedByField
          );
        }}
        handleColor={(data: object) => {
          return handleColor(
            data,
            fieldKey,
            checkedFilterVals,
            ViolationsFiltersGroupedByField
          );
        }}
      />
    </div>
  );
};

export const ViolationsFilterPieCharts = () => {
  const { data, isLoading, error } = useViolationsCountForPieChart();

  const isA11yModeEnabled = useSelector(selectA11yMode);
  const dispatch = useDispatch();
  const isFilterSidebarOpen = useSelector(selectFilterSidebarOpen);
  const handleSidebar = () => {
    dispatch(
      onChangeFilterSidebarOpen({
        isOpen: !isFilterSidebarOpen,
      })
    );
  };

  if (error) {
    return null;
  }

  if (isLoading) {
    return (
      <>
        {Object.keys(ViolationsFiltersGroupedByField).map((fieldKey) => {
          return <Skeleton key={fieldKey} className="h-[150px] w-[150px]" />;
        })}
      </>
    );
  }

  if (!data) {
    return (
      <div className="w-full text-left">Select an application to view</div>
    );
  }

  return (
    <>
      {isA11yModeEnabled ? (
        <div>
          Please use the Filter sidebar to view applied filters.{" "}
          <button
            onClick={() => {
              handleSidebar();
            }}
            aria-label="Open Filter Sidebar"
            className="text-blue-500 underline"
          >
            Click here to open
          </button>
        </div>
      ) : (
        <>
          {Object.keys(ViolationsFiltersGroupedByField).map((fieldKey) => {
            return (
              <ViolationPieChart
                key={fieldKey}
                fieldKey={
                  fieldKey as keyof typeof ViolationsFiltersGroupedByField
                }
              />
            );
          })}
        </>
      )}
    </>
  );
};
