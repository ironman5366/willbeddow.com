import React, { PropsWithChildren } from "react";
import { SAND } from "@/theme";
import CausticBackground from "./CausticBackground";

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
    <div
      className="cozy-container"
      style={{
        ...style,
        minWidth: "100vw",
        minHeight: "calc(100vh - 50px)",
        backgroundColor: SAND,
        position: "relative",
      }}
    >
      <CausticBackground baseColor={SAND} />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
