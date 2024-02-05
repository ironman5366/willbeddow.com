import React, { PropsWithChildren } from "react";
import "./squiggle.css"

export default function SquigglyCard({ children }: PropsWithChildren<any>) {

    return (
        <div className="squiggle-bottom squiggle-top">
            {children}
        </div>
    );
}
