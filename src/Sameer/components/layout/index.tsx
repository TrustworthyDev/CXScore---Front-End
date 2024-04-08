import { useAutoAnimate } from "@formkit/auto-animate/react";
import clsx from "clsx";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectFilterSidebarOpen } from "@/reduxStore/app/app.reducer";

export const Layout = () => {
  const isFilterSidebarOpen = useSelector(selectFilterSidebarOpen);

  const [parent] = useAutoAnimate<HTMLDivElement>();

  return (
    <div className="min-h-screen">
      <a className="skip-main" href="#main">
        Skip to main content
      </a>

      <Navbar className="sticky top-0" />

      <div
        ref={parent}
        className="h-[calc(100vh-100px)] w-full overflow-hidden flex"
        aria-live="polite"
      >
        {/* Sidebar Layout */}
        {isFilterSidebarOpen && (
          <aside
            id="sidebar"
            className={clsx("relative h-full border-b border-gray-300 bg-slate-50 w-full md:w-[unset]")}
          >
            <Sidebar />
          </aside>
        )}

        {/* Main Content Layout */}
        <main
          tabIndex={-1}
          id="main"
          className={clsx("flex-1 overflow-auto")}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};
