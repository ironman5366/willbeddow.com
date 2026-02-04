"use client";

import React, { useEffect, useState } from "react";

interface Props {
  baseColor?: string;
}

export default function CausticBackground({ baseColor = "#e8fffe" }: Props) {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Subtle offset based on mouse position
  const offsetX = (mousePos.x - 0.5) * 30;
  const offsetY = (mousePos.y - 0.5) * 30;

  return (
    <div
      className="caustic-background"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        background: baseColor,
        zIndex: 0,
      }}
    >
      {/* Animated caustic layers */}
      <div
        className="caustic-layer-1"
        style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          transform: `translate(${offsetX}px, ${offsetY}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />
      <div
        className="caustic-layer-2"
        style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          transform: `translate(${-offsetX * 0.5}px, ${-offsetY * 0.5}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />
      <div
        className="caustic-layer-3"
        style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          transform: `translate(${offsetX * 0.3}px, ${offsetY * 0.3}px)`,
          transition: "transform 0.3s ease-out",
        }}
      />
    </div>
  );
}
