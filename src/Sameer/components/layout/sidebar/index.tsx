import { PropsWithChildren } from "react";
import clsx from "clsx";
import { SidebarRoutes } from "../../../../routes";

interface FilterSidebarProps {}

export const FILTER_SIDEBAR_HEADER_HEIGHT_PX = 60;

export const Sidebar = (_props: PropsWithChildren<FilterSidebarProps>) => {
  return (
    <div
      className={clsx(
        "sticky top-0 md:h-[calc(100vh-100px)] md:overflow-y-auto "
      )}
    >
      <SidebarRoutes />
    </div>
  );
};
