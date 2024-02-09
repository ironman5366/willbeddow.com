import React, { PropsWithChildren } from "react";

interface Props {
  style?: React.CSSProperties;
  minHeight?: string;
  minWidth?: string;
}

export default function CozyContainer({
  children,
  style,
  minWidth,
  minHeight,
}: PropsWithChildren<Props>) {
  return (
    <div
      className="cozy-container"
      style={{
        ...style,
        position: "relative",
        minWidth: "100vw",
        minHeight: "calc(100vh - 74px)",
      }}
    >
      {children}
    </div>
  );
}
