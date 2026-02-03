import { createTheme } from "@mantine/core";
import { Inter, Source_Serif_4 } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const sourceSerif = Source_Serif_4({ subsets: ["latin"] });

// Ocean color palette
export const FROZEN_WATER = "#D7FFF1";
export const LIGHT_GREEN = "#AAFCB8";
export const SEAFOAM = "#8CD790";
export const MUTED_TEAL = "#77AF9C";
export const EMERALD_DEPTHS = "#285943";

// Semantic aliases
export const BG_COLOR = FROZEN_WATER;
export const TEXT_COLOR = EMERALD_DEPTHS;
export const ACCENT_COLOR = MUTED_TEAL;

// Legacy exports for compatibility
export const WHITE_SMOKE = BG_COLOR;
export const WINE_MID_COLOR = TEXT_COLOR;
export const WINE_COLOR = EMERALD_DEPTHS;
export const BREE_SERIF = { style: { fontFamily: sourceSerif.style.fontFamily } };

const theme = createTheme({
  breakpoints: {
    xs: "30em",
    sm: "48em",
    md: "64em",
    lg: "74em",
    xl: "90em",
  },
  headings: {
    fontFamily: sourceSerif.style.fontFamily,
  },
  fontFamily: inter.style.fontFamily,
  primaryColor: "ocean",
  defaultRadius: 0,
  colors: {
    ocean: [
      FROZEN_WATER,
      "#c5f5e5",
      "#b3ebd9",
      "#a1e1cd",
      LIGHT_GREEN,
      SEAFOAM,
      MUTED_TEAL,
      "#5a9a84",
      "#3d856b",
      EMERALD_DEPTHS,
    ],
  },
});

export default theme;
