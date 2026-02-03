import React, { PropsWithChildren } from "react";

interface Props {
  style?: React.CSSProperties;
  minHeight?: string;
  minWidth?: string;
}

export default function CozyContainer({
  children,
  style,
}: PropsWithChildren<Props>) {
  return (
    <main
      className="cozy-container"
      style={{
        ...style,
        minWidth: "100vw",
        minHeight: "calc(100vh - 56px)",
      }}
    >
      {children}
    </main>
  );
}
