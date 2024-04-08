import {
  AppShell,
  Box,
  Burger,
  Collapse,
  ThemeIcon,
  UnstyledButton,
  Group,
  Code,
  ScrollArea,
  rem,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconNotes,
  IconCalendarStats,
  IconGauge,
  IconPresentationAnalytics,
  IconFileAnalytics,
  IconChevronRight,
  IconAdjustments,
  IconLock,
} from "@tabler/icons-react";

// import { UserButton } from '../UserButton/UserButton';

import { useState } from "react";

import { Logo } from "~/Sameer/components/atoms/logo/logo";
import { NavbarUserProfile } from "~/Sameer/components/layout/navbar/user-profile";

import classes from "./navbar.module.css";

interface LinksGroupProps {
  icon: React.FC<any>;

  label: string;

  initiallyOpened?: boolean;

  links?: { label: string; link: string }[];
}

function LinksGroup({
  icon: Icon,

  label,

  initiallyOpened,

  links,
}: LinksGroupProps) {
  const hasLinks = Array.isArray(links);

  const [opened, setOpened] = useState(initiallyOpened || false);

  const items = (hasLinks ? links : []).map((link) => (
    <Text<"a">
      component="a"
      className={classes.link}
      href={link.link}
      key={link.label}
      onClick={(event) => event.preventDefault()}
    >
      {link.label}
    </Text>
  ));

  return (
    <>
      <UnstyledButton
        onClick={() => setOpened((o) => !o)}
        className={classes.control}
      >
        <Group justify="space-between" gap={0}>
          <Box style={{ display: "flex", alignItems: "center" }}>
            <ThemeIcon variant="light" size={30}>
              <Icon style={{ width: rem(18), height: rem(18) }} />
            </ThemeIcon>

            <Box ml="md">{label}</Box>
          </Box>

          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              style={{
                width: rem(16),

                height: rem(16),

                transform: opened ? "rotate(-90deg)" : "none",
              }}
            />
          )}
        </Group>
      </UnstyledButton>

      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}

const mockdata = [
  { label: "Dashboard", icon: IconGauge },

  {
    label: "Market news",

    icon: IconNotes,

    initiallyOpened: true,

    links: [
      { label: "Overview", link: "/" },

      { label: "Forecasts", link: "/" },

      { label: "Outlook", link: "/" },

      { label: "Real time", link: "/" },
    ],
  },

  {
    label: "Releases",

    icon: IconCalendarStats,

    links: [
      { label: "Upcoming releases", link: "/" },

      { label: "Previous releases", link: "/" },

      { label: "Releases schedule", link: "/" },
    ],
  },

  { label: "Analytics", icon: IconPresentationAnalytics },

  { label: "Contracts", icon: IconFileAnalytics },

  { label: "Settings", icon: IconAdjustments },

  {
    label: "Security",

    icon: IconLock,

    links: [
      { label: "Enable 2FA", link: "/" },

      { label: "Change password", link: "/" },

      { label: "Recovery codes", link: "/" },
    ],
  },
];

function NavbarNested() {
  const links = mockdata.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Group justify="space-between">
          <Logo style={{ width: rem(120) }} />

          <Code fw={700}>v3.1.2</Code>
        </Group>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>

      <div className={classes.footer}>
        {/* <UserButton /> */}

        <NavbarUserProfile />
      </div>
    </nav>
  );
}

export function SEOLayout() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,

        breakpoint: "sm",

        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />

        <div>Logo</div>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <NavbarNested />
      </AppShell.Navbar>

      <AppShell.Main>Main</AppShell.Main>
    </AppShell>
  );
}
