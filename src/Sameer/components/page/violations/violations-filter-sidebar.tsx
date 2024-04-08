import { ChangeEvent, PropsWithChildren, useCallback } from "react";
import clsx from "clsx";
import { Pill } from "../../atoms/pill";
import FilterData from "../../../lookup/violations/possible-filters.json";
import { useDispatch, useSelector } from "react-redux";
import { CircleClose } from "@/icons/CircleClose";
import {
  ViolationsActionType,
  ViolationsActions,
  ViolationsSelectors,
} from "@/reduxStore/violations/violations";
import { onChangeFilterSidebarOpen } from "@/reduxStore/app/app.actions";
import {
  ViolationsFiltersGroupedByField,
  useViolationsCheckedFilterCount,
} from "../../../lib/violations/count";
import { ViolationWcagSelectionFilter } from "./violation-wcag-selection-filter";
import { ActionIcon, Box, Button, Group, rem, Title } from "@mantine/core";

interface FilterSidebarProps {}

export const FILTER_SIDEBAR_HEADER_HEIGHT_PX = 60;

export const ViolationsFilterSidebar = (
  _props: PropsWithChildren<FilterSidebarProps>
) => {
  const dispatch = useDispatch();

  const checkedFilters = useSelector(ViolationsSelectors.selectCheckedFilters);

  const filterCountsQueryResult = useViolationsCheckedFilterCount();

  const handleChangeFilterSidebarOpen = (isOpen: boolean) => {
    dispatch(onChangeFilterSidebarOpen({ isOpen }));
  };

  const handleSelectAllCheckFilters = () => {
    dispatch(
      ViolationsActions[
        ViolationsActionType.SELECT_ALL_VIOLATIONS_CHECK_FILTERS
      ].action()
    );
  };

  const handleClearAllCheckFilters = () => {
    dispatch(ViolationsActions.CLEAR_ALL_VIOLATIONS_CHECK_FILTERS.action());
  };

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

  const updateCheckbox = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.name as keyof typeof FilterData;
      if (!value) {
        console.log("[DEBUG] updateCheckbox: no name found", e.target);
        return;
      }
      const checked = e.target.checked;
      handleChangeCheckFilters(value, checked);
    },
    [handleChangeCheckFilters]
  );

  return (
    <div className="">
      {/* Sidebar Header */}
      <Box bg="primary" px="lg" py="md">
        <Group justify="space-between">
          <Title order={3} c="white" tt="uppercase">
            Filter
          </Title>
          <ActionIcon
            aria-label="Close Sidebar"
            onClick={() => handleChangeFilterSidebarOpen(false)}
          >
            <CircleClose size={20} className="fill-white" />
          </ActionIcon>
        </Group>
        <Group>
          <Button
            onClick={handleClearAllCheckFilters}
            variant="underline"
            size="compact-sm"
          >
            Clear All
          </Button>
          <Button
            onClick={handleSelectAllCheckFilters}
            variant="underline"
            size="compact-sm"
          >
            Select All
          </Button>
        </Group>
      </Box>
      {/* Sidebar Body */}

      <div className="mx-auto flex min-w-[150px] max-w-[250px] flex-col place-content-center p-4">
        <form className={clsx("space-y-1")}>
          <div className="pb-4 ">
            <ViolationWcagSelectionFilter vertical />
          </div>
          {Object.keys(ViolationsFiltersGroupedByField).map((fieldLabel) => {
            const filters = ViolationsFiltersGroupedByField[fieldLabel];
            return (
            <fieldset name={fieldLabel} key={fieldLabel}>
                <div className="w-full">
                  <legend>
                    <Pill className="!bg-brand-600 py-1 text-center font-display text-sm font-semibold uppercase text-white">
                      {fieldLabel}
                    </Pill>
                  </legend>

                  <div className="space-y-2 px-2 py-2">
                    {Object.keys(filters).map((filter) => {
                      const isInputDisabled =
                        !filterCountsQueryResult.data ||
                        filterCountsQueryResult.data[
                          filter as keyof typeof FilterData
                        ]?.count == 0;
                      return (
                        <div key={filter} className="font-body">
                          <label
                            className={clsx(
                              "flex cursor-pointer items-center space-x-1 ",
                              isInputDisabled && "cursor-not-allowed"
                            )}
                          >
                            <input
                              className={clsx(
                                "cursor-pointer",
                                isInputDisabled &&
                                  "cursor-not-allowed  opacity-75"
                              )}
                              name={filter}
                              disabled={isInputDisabled}
                              // @ts-ignore
                              checked={checkedFilters[filter]}
                              onChange={updateCheckbox}
                              type="checkbox"
                            />
                            <div
                              className={clsx(
                                isInputDisabled &&
                                  "cursor-not-allowed opacity-75",
                                "ml-2 text-xs capitalize tracking-wide"
                              )}
                            >
                              {
                                filters[filter as keyof typeof FilterData]
                                  ?.label
                              }{" "}
                              {!!filterCountsQueryResult.data &&
                                `(${
                                  filterCountsQueryResult.data[
                                    filter as keyof typeof FilterData
                                  ]?.count ?? `0`
                                })`}
                            </div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </fieldset>
            );
          })}
        </form>
      </div>
    </div>
  );
};
