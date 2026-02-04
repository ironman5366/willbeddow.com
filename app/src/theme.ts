import { createTheme } from "@mantine/core";
import { Space_Mono, Inter } from "next/font/google";

const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });
const inter = Inter({ subsets: ["latin"] });

// Ocean/beachy color palette - light pool water tones
export const SAND = "#e8fffe"; // Lighter pool water background
export const POOL_LIGHT = "#ffffff"; // Caustic light highlights
export const SEAFOAM = "#AAFCB8"; // Light Green
export const SAGE = "#8CD790"; // Light Green
export const TEAL = "#77AF9C"; // Muted Teal - accent
export const DEEP = "#285943"; // Emerald Depths - primary text/borders

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
      "#e8fffe",
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
      "#e8fffe",
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
      "#f8fffe",
      "#f2fffe",
      "#edfffe",
      "#e8fffe",
      "#e8fffe",
      "#e8fffe",
      "#e8fffe",
      "#e8fffe",
      "#e8fffe",
    ],
  },
});

export default theme;
