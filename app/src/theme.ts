import { createTheme } from "@mantine/core";
import { Bree_Serif, Chicle } from "next/font/google";

const chicle = Chicle({ subsets: ["latin"], weight: "400" });
const breeSerif = Bree_Serif({ subsets: ["latin"], weight: "400" });

// We want to use these in a server component that doesn't have mantine access
export const WHITE_SMOKE = "#F5F5F5";
export const WINE_MID_COLOR = "#984755";
export const WINE_COLOR = "#753742";

const theme = createTheme({
  breakpoints: {
    xs: "30em",
    sm: "48em",
    md: "64em",
    lg: "74em",
    xl: "90em",
  },
  headings: {
    fontFamily: chicle.style.fontFamily,
  },
  fontFamily: breeSerif.style.fontFamily,
  primaryColor: "wine",
  colors: {
    mint: [
      "#bcffde",
      "#b2ffd2",
      "#a8ffc6",
      "#9effbb",
      "#94f4af",
      "#8ae4a3",
      "#80d398",
      "#76c38c",
      "#6cb380",
      "#63A375",
    ],
    africanViolet: [
      "#fffcff",
      "#ffefff",
      "#ffe2ff",
      "#ffd4ff",
      "#ffc7fa",
      "#f7bae9",
      "#e6acd9",
      "#d49fc8",
      "#c292b7",
      "#B185A7",
    ],
    wine: [
      "#de687d",
      "#d26376",
      "#c65d70",
      "#bb5869",
      "#af5263",
      "#a34d5c",
      WINE_MID_COLOR,
      "#8c424f",
      "#803c48",
      WINE_COLOR,
    ],
    carrotOrange: [
      "#ffff09",
      "#ffff09",
      "#fff408",
      "#ffe608",
      "#ffd807",
      "#ffc907",
      "#ffbb06",
      "#ffac06",
      "#ff9e05",
      "#E89005",
    ],
    whiteSmoke: [
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#ffffff",
      WHITE_SMOKE,
    ],
  },
});

export default theme;
