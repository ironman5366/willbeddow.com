import React, { PropsWithChildren } from "react";
import "./squiggle.css";
import SquiggleBox from "../../../public/squiggle/box.svg";

export default function SquigglyCard({ children }: PropsWithChildren<any>) {
  return (
    <div
      style={{
        border: "10px solid transparent", // Set the border width
        borderImage: `url(${SquiggleBox.src}) 30 30 30 30 fill`,
        borderImageSlice: "30 fill", // Adjust slice values
        borderImageRepeat: "stretch", // Repeat the image to avoid stretching
      }}
    >
      {children}
    </div>
  );
}
