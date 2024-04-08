import { onChangeFilterSidebarOpen } from "@/reduxStore/app/app.actions";
import { selectFilterSidebarOpen } from "@/reduxStore/app/app.reducer";
import { PropsWithChildren } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FilterIcon } from "@/icons/Filter";
import { Route, Routes } from "react-router-dom";
import clsx from "clsx";

interface FilterButtonProps {
  // callback fn called before the sidebar is toggled
  beforeToggle?: (isOpen: boolean) => void;
}

export const FilterButton = (props: PropsWithChildren<FilterButtonProps>) => {
  const isFilterSidebarOpen = useSelector(selectFilterSidebarOpen);
  const dispatch = useDispatch();

  const handleChangeFilterSidebarOpen = (isOpen: boolean) => {
    dispatch(onChangeFilterSidebarOpen({ isOpen }));
  };

  const toggle = () => {
    if (props.beforeToggle) {
      props.beforeToggle(isFilterSidebarOpen);
    }
    handleChangeFilterSidebarOpen(!isFilterSidebarOpen);
  };

  return (
    <Routes>
      <Route path="/violations/*" element={<FilterToggle toggle={toggle} />} />
      <Route
        path="/guided-validation/*"
        element={<FilterToggle toggle={toggle} />}
      />
      <Route path="*" element={<FilterToggle disabled />} />
    </Routes>
  );
};

const FilterToggle = (props: { toggle?: () => void; disabled?: boolean }) => {
  return (
    <button
      onClick={props.toggle ?? (() => {})}
      className={clsx(
        "text-md flex items-center space-x-2 p-1 md:text-sm",
        props.disabled
          ? "cursor-not-allowed stroke-gray-400 text-gray-400"
          : "cursor-pointer stroke-gray-800 text-gray-800"
      )}
      aria-label="Filter"
      disabled={props.disabled}
    >
      <FilterIcon />
      <span className="font-display uppercase ">Filter</span>
    </button>
  );
};
