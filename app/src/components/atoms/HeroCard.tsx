import React, { ReactNode } from "react";
import { DEEP } from "@/theme";
import { EMAIL } from "@/constants";
import FancyLink from "@/components/atoms/FancyLink";

const SECTIONS: ReactNode[] = [
  "I'm a programmer and occasional blogger. I like writing code, being outside, and websites that feel cozy.",
  <>
    I live in San Francisco and work at{" "}
    <FancyLink href={"https://krea.ai"}>Krea</FancyLink>.
  </>,
  <>
    You can find my code at{" "}
    <FancyLink href={"https://github.com/ironman5366"}>
      github.com/ironman5366
    </FancyLink>
    , or email me at{" "}
    <FancyLink href={`mailto:${EMAIL}`}>{EMAIL}</FancyLink>.
  </>,
];

export default function HeroCard() {
  return (
    <div
      className="box"
      style={{
        color: DEEP,
        maxWidth: "500px",
      }}
    >
      <h1
        style={{
          fontSize: "1.75em",
          marginBottom: "16px",
          fontWeight: 700,
        }}
      >
        Hi, I'm Will
      </h1>
      {SECTIONS.map((section, i) => (
        <p
          key={i}
          style={{
            fontSize: "1em",
            lineHeight: 1.5,
            margin: "8px 0",
          }}
        >
          {section}
        </p>
      ))}
    </div>
  );
}
