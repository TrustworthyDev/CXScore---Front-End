import {
  ActionIcon,
  Button,
  Checkbox,
  DEFAULT_THEME,
  DefaultMantineColor,
  Divider,
  MantineColorsTuple,
  Menu,
  Select,
  createTheme,
  mergeMantineTheme,
  rem,
} from "@mantine/core";

type ExtendedCustomColors =
  | "primary"
  | "secondary"
  | "accent"
  | "accentSecondary"
  | DefaultMantineColor;

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, MantineColorsTuple>;
  }
}

import buttonClasses from "./Buttons.module.css";
import checkboxClasses from "./Checkboxes.module.css";
import menuClasses from "./Menus.module.css";
import selectClasses from "./Selections.module.css";
const themeOverride = createTheme({
  colors: {
    primary: [
      "#e9f3ff",
      "#d4e4fb",
      "#abc6f0",
      "#7ea7e6",
      "#588cdd",
      "#407bd8",
      "#3173d7",
      "#2261bf",
      "#1856ac",
      "#004a99",
    ],
    secondary: [
      "#eef4ff",
      "#e3e5ef",
      "#c6c8d5",
      "#a7aabd",
      "#8c90a8",
      "#7b7f9b",
      "#737796",
      "#616683",
      "#555a76",
      "#474e6b",
    ],
    accent: [
      "#ffe9f3",
      "#ffd3e1",
      "#f7a4c0",
      "#f1739c",
      "#ec497f",
      "#e92f6c",
      "#e82062",
      "#cf1152",
      "#ba0648",
      "#a4003e",
    ],
    accentSecondary: [
      "#f5edff",
      "#e3d9fa",
      "#c3b1ec",
      "#a285df",
      "#8660d4",
      "#7449ce",
      "#6b3dcc",
      "#5b2fb5",
      "#5029a3",
      "#442290",
    ],
  },

  primaryColor: "primary",

  //fontFamily: "sans-serif",

  fontSizes: {
    xxxs: rem(8),
    xxs: rem(10),
    xs: rem(12),
    sm: rem(14),
    md: rem(16),
    lg: rem(22),
    xl: rem(28),
    "2xl": rem(44),
    "3xl": rem(52),
  },
  radius: {
    xs: rem(4),
    sm: rem(8),
    md: rem(10),
    lg: rem(20),
    xl: rem(40),
    max: rem(2000),
  },
  defaultRadius: "xs",
  spacing: {
    xxs: rem(2),
    xs: rem(4),
    sm: rem(7),
    md: rem(9),
    lg: rem(16),
    xl: rem(24),
    "2xl": rem(48),
    "3xl": rem(60),
    "4xl": rem(96),
  },

  components: {
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        variant: "transparent",
      },
    }),
    Button: Button.extend({
      classNames: buttonClasses,
    }),
    Checkbox: Checkbox.extend({
      classNames: checkboxClasses,
    }),
    Divider: Divider.extend({
      defaultProps: {
        color: "gray",
        size: "md",
      },
    }),
    Menu: Menu.extend({
      classNames: menuClasses,
    }),
    Select: Select.extend({
      classNames: selectClasses,
    }),
  },
});

const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);

export default theme;
