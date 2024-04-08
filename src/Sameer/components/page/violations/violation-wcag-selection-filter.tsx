import { Checkbox, Flex, Image, rem } from "@mantine/core";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";

import {
  ViolationsActions,
  ViolationsSelectors,
} from "@/reduxStore/violations/violations";
import images from "~/assets";

export const ViolationWcagSelectionFilter = (props: { vertical?: boolean }) => {
  const dispatch = useDispatch();
  const selectedFilters = useSelector(
    ViolationsSelectors.selectSelectedWcagFilters
  );

  const isSelected = (wcagVersion: string) => {
    return selectedFilters.includes(wcagVersion);
  };

  const handleSelect = (wcagVersion: string) => {
    dispatch(
      ViolationsActions.SET_VIOLATION_SELECTED_WCAG_FILTERS.action({
        selectedWcagFilters: [
          ...(isSelected(wcagVersion)
            ? selectedFilters.filter((filter) => filter !== wcagVersion)
            : [...selectedFilters, wcagVersion]),
        ],
      })
    );
  };

  return (
    <Flex
      align="center"
      gap={props.vertical ? "sm" : "md"}
      direction={props.vertical ? "column" : "row"}
    >
      <div
        className={clsx(
          "flex items-center gap-2 font-display font-semibold",
          props.vertical
            ? "w-full justify-center rounded-full border border-brand-700 py-1 px-2 text-sm uppercase"
            : " text-2xl"
        )}
      >
        <div>WCAG Version</div>
        <Image src={images.w3cImg} h={rem(20)} alt="W3C Logo" />
      </div>
      <fieldset
        className={clsx("flex items-center gap-3", props.vertical && "")}
        title={
          "WCAG version selection filter. Select the WCAG version you want to filter by. Currently selected: " +
          selectedFilters.join(", ")
        }
      >
        <legend className="sr-only">WCAG version selection</legend>
        {["2.0", "2.1", "2.2", "3.0"].map((wcagVersion) => {
          return (
            <Checkbox
              key={wcagVersion}
              label={wcagVersion}
              checked={isSelected(wcagVersion)}
              onChange={() => handleSelect(wcagVersion)}
            />
          );
        })}
      </fieldset>
    </Flex>
  );

  return (
    <div
      className={clsx(
        "flex items-center gap-4",
        props.vertical && "flex-col !gap-2"
      )}
    >
      <div
        className={clsx(
          "flex items-center gap-2 font-display font-semibold",
          props.vertical
            ? "w-full justify-center rounded-full border border-brand-700 py-1 px-2 text-sm uppercase"
            : " text-2xl"
        )}
      >
        <div>WCAG Version</div>
        <img src={images.w3cImg} className={clsx("h-5")} alt="W3C Logo" />
      </div>
      <fieldset
        className={clsx("flex items-center gap-3", props.vertical && "")}
        title={
          "WCAG version selection filter. Select the WCAG version you want to filter by. Currently selected: " +
          selectedFilters.join(", ")
        }
      >
        {["2.0", "2.1", "2.2", "3.0"].map((wcagVersion) => {
          return (
            <label
              key={wcagVersion}
              className={clsx("flex cursor-pointer items-center space-x-1")}
            >
              <input
                className={clsx("cursor-pointer")}
                checked={isSelected(wcagVersion)}
                onChange={() => handleSelect(wcagVersion)}
                aria-label={
                  isSelected(wcagVersion)
                    ? `Unselect WCAG ${wcagVersion}`
                    : `Select WCAG ${wcagVersion}`
                }
                type="checkbox"
              />
              <div className={clsx("text-md ml-2 capitalize tracking-wide")}>
                {wcagVersion}
              </div>
            </label>
          );
        })}
      </fieldset>
    </div>
  );
};

