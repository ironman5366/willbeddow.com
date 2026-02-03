import { createTheme } from "@mantine/core";
import { IBM_Plex_Mono, Inter } from "next/font/google";

const ibmPlexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

// Ocean/beach color palette - clean and minimal
export const BACKGROUND_COLOR = "#FAFCFC";
export const PRIMARY_COLOR = "#285943"; // Emerald Depths - main accent
export const SECONDARY_COLOR = "#77AF9C"; // Muted Teal - softer accent
export const LIGHT_ACCENT = "#D7FFF1"; // Frozen Water - very light backgrounds
export const TEXT_COLOR = "#1a1a1a"; // Near black for readability

// Legacy exports for compatibility during transition
export const WHITE_SMOKE = BACKGROUND_COLOR;
export const WINE_MID_COLOR = PRIMARY_COLOR;
export const WINE_COLOR = PRIMARY_COLOR;
export const BREE_SERIF = inter;

const theme = createTheme({
  breakpoints: {
    xs: "30em",
    sm: "48em",
    md: "64em",
    lg: "74em",
    xl: "90em",
  },
  headings: {
    fontFamily: ibmPlexMono.style.fontFamily,
  },
  fontFamily: inter.style.fontFamily,
  primaryColor: "ocean",
  colors: {
    ocean: [
      "#E8FFF7",
      "#D7FFF1",
      "#AAFCB8",
      "#8CD790",
      "#77AF9C",
      "#5A9A84",
      "#4A8A74",
      "#3A7A64",
      "#2C6A54",
      "#285943",
    ],
    sand: [
      "#FFFEF7",
      "#FDF9ED",
      "#F5EFD9",
      "#EDE5C5",
      "#E5DBB1",
      "#DDD19D",
      "#D5C789",
      "#CDBD75",
      "#C5B361",
      "#BDA94D",
    ],
    slate: [
      "#F8FAFB",
      "#F1F5F6",
      "#E4EAEC",
      "#D7DFE2",
      "#CAD4D8",
      "#BDC9CE",
      "#B0BEC4",
      "#A3B3BA",
      "#96A8B0",
      "#899DA6",
    ],
  },
});

export default theme;
