import { Pill } from "../../atoms/pill";
import FilterData from "../../../lookup/guided/possible-filters.json";
import { Loading } from "../../atoms/loading";
import { Skeleton } from "../../atoms/loading/skeleton";
import { useDispatch, useSelector } from "react-redux";
import {
  GuidedFiltersGroupedByField,
  useGuidedCheckedFilterCount,
  useGuidedCountForPieChart,
} from "../../../lib/guided/count";
import { GuidedActions, GuidedSelectors } from "@/reduxStore/guided/guided";
import PieChart, {
  handleClickPieChart,
  handleColor,
  prepareData,
} from "../../../../Suraj/component/common/PieChart";
import "../violations/violations.css";
import {
  selectA11yMode,
  selectFilterSidebarOpen,
} from "@/reduxStore/app/app.reducer";
import { onChangeFilterSidebarOpen } from "@/reduxStore/app/app.actions";

const checkedColor = "#3b82f6";
const uncheckedColor = "#bfdbfeb3";

const usePieChartData = (
  fieldKey: keyof typeof GuidedFiltersGroupedByField
) => {
  const countQueryResult = useGuidedCheckedFilterCount();

  const checkedFilters = useSelector(GuidedSelectors.selectCheckedFilters);

  const filter = GuidedFiltersGroupedByField[fieldKey];

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

const GuidedViolationPieChart = (props: {
  fieldKey: keyof typeof GuidedFiltersGroupedByField;
}) => {
  const { fieldKey } = props;

  const { data, isLoading, error } = usePieChartData(fieldKey);

  const checkedFilterVals = useSelector(GuidedSelectors.selectCheckedFilters);

  const dispatch = useDispatch();
  const handleChangeCheckFilters = (
    filter: keyof typeof FilterData,
    isChecked: boolean
  ) => {
    dispatch(
      GuidedActions.CHANGE_GUIDED_CHECK_FILTERS.action({
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
        GuidedFiltersGroupedByField[fieldKey]
      )[0] as keyof typeof FilterData
    ];

  return (
    <div className="testmanual flex min-w-[150px] flex-col place-content-center gap-2">
      <Pill className="text-center font-body text-xs font-semibold">
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
            GuidedFiltersGroupedByField
          );
        }}
        handleColor={(data: object) => {
          return handleColor(
            data,
            fieldKey,
            checkedFilterVals,
            GuidedFiltersGroupedByField
          );
        }}
      />
    </div>
  );
};

export const GuidedFilterPieCharts = () => {
  const { data, isLoading, error } = useGuidedCountForPieChart();
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
        {Object.keys(GuidedFiltersGroupedByField).map((fieldKey) => {
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
          {Object.keys(GuidedFiltersGroupedByField).map((fieldKey) => {
            return (
              <GuidedViolationPieChart
                key={fieldKey}
                fieldKey={fieldKey as keyof typeof GuidedFiltersGroupedByField}
              />
            );
          })}
        </>
      )}
    </>
  );
};
