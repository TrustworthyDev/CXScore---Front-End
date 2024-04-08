import { useAutoAnimate } from "@formkit/auto-animate/react";
import clsx from "clsx";
import { PropsWithChildren } from "react";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectFilterSidebarOpen } from "@/reduxStore/app/app.reducer";

interface LayoutProps {}

export const GuestLayout = (props: PropsWithChildren<LayoutProps>) => {
  const [parent] = useAutoAnimate<HTMLDivElement>();

  return (
    <div className="min-h-screen">
      <a className="skip-main" href="#main">
        Skip to main content
      </a>

      <div ref={parent} className="w-full grid-cols-12">
        {/* Main Content Layout */}
        <main tabIndex={-1} id="main" className={clsx("col-span-12")}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
