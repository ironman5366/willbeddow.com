import { createTheme } from "@mantine/core";
import { Space_Mono, Inter } from "next/font/google";

const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });
const inter = Inter({ subsets: ["latin"] });

// Ocean/beachy color palette
export const SAND = "#D7FFF1"; // Frozen Water - light background
export const SEAFOAM = "#AAFCB8"; // Light Green
export const SAGE = "#8CD790"; // Light Green
export const TEAL = "#77AF9C"; // Muted Teal - accent
export const DEEP = "#285943"; // Emerald Depths - primary text/borders

// Caustic background colors
export const POOL_DEEP = "#2A9090"; // Deep teal base
export const POOL_LIGHT = "#FFF9E6"; // Warm cream/yellow for daylight feel

// Legacy exports for compatibility
export const WHITE_SMOKE = SAND;
export const WINE_MID_COLOR = DEEP;
export const WINE_COLOR = DEEP;

const theme = createTheme({
  breakpoints: {
    xs: "30em",
    sm: "48em",
    md: "64em",
    lg: "74em",
    xl: "90em",
  },
  headings: {
    fontFamily: spaceMono.style.fontFamily,
  },
  fontFamily: inter.style.fontFamily,
  primaryColor: "ocean",
  defaultRadius: 0,
  colors: {
    ocean: [
      "#D7FFF1",
      "#C4F8E5",
      "#B0F0D9",
      "#9DE8CD",
      "#8CD790",
      "#7BC683",
      "#77AF9C",
      "#5A9A7F",
      "#3D8562",
      "#285943",
    ],
    teal: [
      "#D7FFF1",
      "#C5EFE4",
      "#B3DFD7",
      "#A1CFCA",
      "#8FBFBD",
      "#7DAFB0",
      "#77AF9C",
      "#5F9A86",
      "#478570",
      "#285943",
    ],
    sand: [
      "#ffffff",
      "#f8fffc",
      "#f0fff8",
      "#e8fff4",
      "#e0fff0",
      "#D7FFF1",
      "#D7FFF1",
      "#D7FFF1",
      "#D7FFF1",
      "#D7FFF1",
    ],
  },
});

export default theme;
