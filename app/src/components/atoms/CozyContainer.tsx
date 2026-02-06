"use client";

import React, { PropsWithChildren } from "react";
import { POOL_DEEP, POOL_LIGHT } from "@/theme";
import dynamic from "next/dynamic";

const CausticBackground = dynamic(() => import("./CausticBackground"), {
  ssr: false,
});

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
        position: "relative",
        minWidth: "100vw",
        minHeight: "calc(100vh - 50px)",
        backgroundColor: POOL_DEEP,
        overflow: "hidden",
      }}
    >
      <CausticBackground
        baseColor={POOL_DEEP}
        lightColor={POOL_LIGHT}
        intensity={0.7}
        speed={1}
        mouseInfluence={0.15}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
