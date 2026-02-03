import { createTheme } from "@mantine/core";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

// Clean, minimal color palette inspired by web 2.0 aesthetic
export const CREAM = "#FAF8F5";
export const CHARCOAL = "#2D2D2D";
export const CHARCOAL_LIGHT = "#4A4A4A";

// Fun accent colors - muted but playful
export const SAGE = "#8B9F82";
export const SOFT_BLUE = "#7B9EB9";
export const MUTED_GOLD = "#C9A961";
export const SOFT_PURPLE = "#9B8AA6";
export const DUSTY_ROSE = "#C4A4A4";

const theme = createTheme({
  breakpoints: {
    xs: "30em",
    sm: "48em",
    md: "64em",
    lg: "74em",
    xl: "90em",
  },
  headings: {
    fontFamily: inter.style.fontFamily,
  },
  fontFamily: inter.style.fontFamily,
  primaryColor: "charcoal",
  defaultRadius: 0,
  colors: {
    charcoal: [
      "#f5f5f5",
      "#e5e5e5",
      "#d4d4d4",
      "#a3a3a3",
      "#737373",
      "#525252",
      "#404040",
      CHARCOAL_LIGHT,
      "#363636",
      CHARCOAL,
    ],
    sage: [
      "#f4f6f3",
      "#e8ece6",
      "#d5ddd2",
      "#b8c7b2",
      "#9fb396",
      SAGE,
      "#7a8f72",
      "#6a7e63",
      "#5a6d54",
      "#4a5c46",
    ],
    softBlue: [
      "#f5f8fa",
      "#e8eff4",
      "#d4e2ec",
      "#b3cfe0",
      "#97bdd4",
      SOFT_BLUE,
      "#6b8fa8",
      "#5c7f96",
      "#4d6f84",
      "#3e5f72",
    ],
    gold: [
      "#fdfbf5",
      "#faf5e8",
      "#f5edd4",
      "#ebe0b8",
      "#e0d29b",
      MUTED_GOLD,
      "#b89651",
      "#a68543",
      "#947436",
      "#826329",
    ],
    purple: [
      "#f8f6f9",
      "#f0ebf2",
      "#e3dae7",
      "#d1c3d8",
      "#bfadc9",
      SOFT_PURPLE,
      "#8a7995",
      "#796884",
      "#685773",
      "#574662",
    ],
    rose: [
      "#faf7f7",
      "#f5eeee",
      "#ebe0e0",
      "#ddcdcd",
      "#d1bbbb",
      DUSTY_ROSE,
      "#b39393",
      "#a18282",
      "#8f7171",
      "#7d6060",
    ],
  },
});

export default theme;
