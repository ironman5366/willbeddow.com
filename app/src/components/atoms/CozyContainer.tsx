import React, {PropsWithChildren} from "react";
import flower from "../../../public/flower.svg";
import {WHITE_SMOKE} from "@/theme";

export default function CozyContainer({ children, style }: PropsWithChildren<{
    style?: React.CSSProperties
}>) {
    return <div style={{
        backgroundImage: `url(${flower.src})`,
        backgroundRepeat: "repeat",
        backgroundColor: WHITE_SMOKE,
        minHeight: "100vh",
        minWidth: "100vw",
        padding: 60,
        ...style,
    }}>
        {children}
    </div>
}
