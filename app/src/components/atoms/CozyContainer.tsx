import React, { PropsWithChildren } from "react";

export default function CozyContainer({
  children,
  style,
}: PropsWithChildren<{
  style?: React.CSSProperties;
}>) {
  return (
    <div
      className="cozy-container"
      style={{
        ...style,
      }}
    >
      {children}
    </div>
  );
}
