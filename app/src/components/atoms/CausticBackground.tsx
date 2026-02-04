"use client";

import React, { useEffect, useState } from "react";

interface Props {
  baseColor?: string;
  lightColor?: string;
}

export default function CausticBackground({
  baseColor = "#e8fffe",
  lightColor = "#ffffff",
}: Props) {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to 0-1 range
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Subtle offset based on mouse position
  const offsetX = (mousePos.x - 0.5) * 20;
  const offsetY = (mousePos.y - 0.5) * 20;

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
      {/* SVG filter definition */}
      <svg
        style={{
          position: "absolute",
          width: 0,
          height: 0,
        }}
      >
        <defs>
          <filter id="caustic-filter" x="-50%" y="-50%" width="200%" height="200%">
            {/* Create organic noise pattern */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015 0.015"
              numOctaves="3"
              seed="5"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                values="0.015 0.015;0.018 0.012;0.012 0.018;0.015 0.015"
                dur="20s"
                repeatCount="indefinite"
              />
            </feTurbulence>

            {/* Displacement for wavy distortion */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="30"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Gradient for light rays */}
          <radialGradient id="light-gradient" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor={lightColor} stopOpacity="0.4" />
            <stop offset="50%" stopColor={lightColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={lightColor} stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* Animated caustic layer */}
      <div
        className="caustic-layer"
        style={{
          position: "absolute",
          top: "-20%",
          left: "-20%",
          width: "140%",
          height: "140%",
          transform: `translate(${offsetX}px, ${offsetY}px)`,
          transition: "transform 0.3s ease-out",
        }}
      >
        {/* Multiple overlapping shapes create caustic pattern */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid slice"
          style={{ filter: "url(#caustic-filter)" }}
        >
          {/* Light cells - organic shapes that create the caustic look */}
          <g opacity="0.6">
            <ellipse cx="200" cy="150" rx="180" ry="120" fill="url(#light-gradient)">
              <animate
                attributeName="cx"
                values="200;250;180;200"
                dur="15s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="150;180;130;150"
                dur="12s"
                repeatCount="indefinite"
              />
            </ellipse>
            <ellipse cx="500" cy="300" rx="200" ry="150" fill="url(#light-gradient)">
              <animate
                attributeName="cx"
                values="500;450;520;500"
                dur="18s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="300;350;280;300"
                dur="14s"
                repeatCount="indefinite"
              />
            </ellipse>
            <ellipse cx="650" cy="100" rx="150" ry="100" fill="url(#light-gradient)">
              <animate
                attributeName="cx"
                values="650;680;620;650"
                dur="16s"
                repeatCount="indefinite"
              />
            </ellipse>
            <ellipse cx="100" cy="400" rx="170" ry="130" fill="url(#light-gradient)">
              <animate
                attributeName="cy"
                values="400;450;380;400"
                dur="13s"
                repeatCount="indefinite"
              />
            </ellipse>
            <ellipse cx="400" cy="500" rx="220" ry="140" fill="url(#light-gradient)">
              <animate
                attributeName="cx"
                values="400;450;350;400"
                dur="17s"
                repeatCount="indefinite"
              />
            </ellipse>
            <ellipse cx="700" cy="450" rx="160" ry="110" fill="url(#light-gradient)">
              <animate
                attributeName="cx"
                values="700;720;680;700"
                dur="14s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="450;480;420;450"
                dur="11s"
                repeatCount="indefinite"
              />
            </ellipse>
          </g>
        </svg>
      </div>

      {/* Secondary subtle wave overlay */}
      <div
        className="wave-overlay"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(ellipse at ${30 + mousePos.x * 40}% ${20 + mousePos.y * 30}%, ${lightColor}33 0%, transparent 50%),
            radial-gradient(ellipse at ${60 - mousePos.x * 20}% ${70 - mousePos.y * 20}%, ${lightColor}22 0%, transparent 40%)
          `,
          transition: "background 0.5s ease-out",
        }}
      />
    </div>
  );
}
