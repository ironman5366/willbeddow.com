import {createTheme} from "@mantine/core";
import {Bree_Serif, Chicle} from "next/font/google";

const chicle = Chicle({subsets: ["latin"], weight: "400"})
const breeSerif = Bree_Serif({subsets: ["latin"], weight: "400"})

const theme = createTheme({
    breakpoints: {
        xs: '30em',
        sm: '48em',
        md: '64em',
        lg: '74em',
        xl: '90em',
    },
    headings: {
        fontFamily: chicle.style.fontFamily,
    },
    fontFamily: breeSerif.style.fontFamily,
});

export default theme;
