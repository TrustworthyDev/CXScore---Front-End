import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Button, Group } from "@mantine/core";
import clsx from "clsx";
import React, { PropsWithChildren, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { CircleClose } from "@/icons/CircleClose";
import { HamburgerMenuIcon } from "@/icons/HamburgerMenu";
import { BrandType } from "@/types/enum";

import { NavbarUserProfile } from "./user-profile";
import { RoleType } from "../../../../Suraj/pages/settings/settings-api.d";
import { usePersistedBrandType } from "../../../lib/application/use-brand-type";
import { useUser } from "../../../lib/application/use-login";
import { FilterButton } from "../../atoms/button/filter-button";
import { Logo } from "../../atoms/logo/logo";
import { HorizontalSeparator } from "../../atoms/seperator/horizontal-separator";
import { VerticalSeparator } from "../../atoms/seperator/vertical-separator";
import { FILTER_SIDEBAR_HEADER_HEIGHT_PX } from "../sidebar";

interface NavbarProps {
  className?: string;
}

const RnREnabled = !(import.meta.env.VITE_DISABLE_RR === "true");

const links = [
  {
    href: "/home",
    label: "Home",
  },
  {
    href: "/violations",
    label: "Violations",
  },
  {
    href: "/guided-validation",
    label: "Guided Validation",
  },
  {
    href: "/rules",
    label: "Rules",
  },
  // {
  //   href: "/reports",
  //   label: "Reports",
  // },
  {
    href: "/scans",
    label: "Scans",
  },
  {
    href: "/scheduler",
    label: "Scheduler",
  },
  {
    href: "/performance",
    label: "Performance",
  },
  // {
  //   href: "/graphs",
  //   label: "Graphs",
  // },
  {
    href: "/design",
    label: "Design",
  },
  ...(RnREnabled
    ? [
        {
          href: "/recreplay",
          label: "Record & Replay",
        },
      ]
    : []),
  // {
  //   href: "/compare",
  //   label: "Compare",
  // },
  // {
  //   href: "/help",
  //   label: "Help",
  // },
];

export const Navbar = (props: PropsWithChildren<NavbarProps>) => {
  const { pathname } = useLocation();
  const [isMenuOpen, setMenuOpen] = React.useState(false);
  const [parent] = useAutoAnimate<HTMLElement>({
    duration: 100,
  });

  const [navLinks, setNavLinks] = React.useState(links);
  const { brandType } = usePersistedBrandType();
  const { data: user } = useUser();
  const handleMenuClick = () => {
    setMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (user && user?.role === RoleType.ADMIN) {
      setNavLinks([
        ...links,
        {
          href: "/settings",
          label: "Settings",
        },
      ]);
    }
  }, [user]);

  return (
    <nav
      ref={parent}
      className={clsx(
        "z-10 flex min-h-[60px] flex-col items-stretch justify-between border-gray-300 bg-white shadow-md md:h-[100px]",
        // isMenuOpen && "border-b md:border-0",
        props.className,
      )}
    >
      <div
        className={clsx(
          `flex flex-wrap items-center justify-between space-x-2 border-b 
          border-gray-300 md:border-0`,
        )}
      >
        <div
          className={clsx(
            `flex h-[60px] items-center space-x-4 self-stretch
          py-2 px-4 font-display text-2xl font-bold
         text-white md:space-x-0`,
            brandType === BrandType.accessbot ? "bg-brand-600" : "bg-white",
          )}
        >
          <button
            onClick={handleMenuClick}
            aria-label="Open Menu"
            className="md:hidden"
          >
            {isMenuOpen ? (
              <CircleClose size={22} className="fill-white" />
            ) : (
              <HamburgerMenuIcon className="stroke-white" />
            )}
          </button>
          <Link to="/" aria-label="Go Home">
            <Logo />
          </Link>
        </div>

        {/* <ScanInputBar className="flex-grow" /> */}
        <Group mr="lg" gap="xl" wrap="wrap">
          <Link to="/scans" aria-label="Submit new scan request">
            <Button tt="uppercase">Submit new scan request</Button>
          </Link>

          <NavbarUserProfile />
        </Group>
      </div>

      <div className="hidden h-full items-center space-x-4 border-y bg-slate-50 px-2 md:flex">
        <FilterButton />

        <VerticalSeparator className="bg-gray-300" />

        <ul
          aria-label="Navigation Links"
          className="flex items-center space-x-4 font-body text-sm"
        >
          {navLinks.map((link) => {
            return (
              <li key={link.href}>
                <Link
                  aria-current={
                    pathname.startsWith(link.href) ? "page" : undefined
                  }
                  className={clsx(
                    "hover:text-brand-600 focus:text-brand-600",
                    pathname.startsWith(link.href)
                      ? "font-semibold text-brand-600"
                      : "text-gray-800",
                  )}
                  to={link.href}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {isMenuOpen && (
        <div
          className="space-y-4 border-b border-gray-300 bg-white 
        p-4 py-6 shadow-md md:hidden"
        >
          <ul
            aria-label="Navigation Links"
            className="text-md space-y-4 font-body"
          >
            {links.map((link) => {
              return (
                <li key={link.href}>
                  <a
                    className={clsx(
                      "hover:text-brand-600 focus:text-brand-600",
                      pathname.startsWith(link.href)
                        ? "font-semibold text-brand-600"
                        : "text-gray-800",
                    )}
                    href={link.href}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
          <HorizontalSeparator />
          <FilterButton
            // scrolls to the top of the filter bar when it is opened [on mobile]
            beforeToggle={(isSidebarOpen) => {
              // filter bar toggled, close the nav menu
              setMenuOpen(false);
              // scroll to filter bar if we are opening it
              setTimeout(() => {
                const filter = document.getElementById("sidebar");
                // run only if it is currently closed, i.e going to open
                if (!isSidebarOpen && filter && window?.scrollTo) {
                  // height of sidebar header
                  const offset = FILTER_SIDEBAR_HEADER_HEIGHT_PX;
                  const elementPosition = filter.getBoundingClientRect().top;
                  const offsetPosition =
                    elementPosition + window.pageYOffset - offset;

                  window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                  });
                }
              }, 200);
            }}
          />
          <Button w="100%">Submit new scan request</Button>
        </div>
      )}
    </nav>
  );
};

