import React, { ReactNode } from "react";
import { DEEP } from "@/theme";
import { EMAIL } from "@/constants";
import FancyLink from "@/components/atoms/FancyLink";

const SECTIONS: ReactNode[] = [
  "programmer and occasional blogger. i like writing code, being outside, and websites that feel fast.",
  <>
    living in san francisco, working at{" "}
    <FancyLink href={"https://krea.ai"}>krea</FancyLink>.
  </>,
  <>
    code at{" "}
    <FancyLink href={"https://github.com/ironman5366"}>
      github.com/ironman5366
    </FancyLink>
  </>,
  <>
    reach me at{" "}
    <FancyLink href={`mailto:${EMAIL}`}>{EMAIL}</FancyLink>
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
        hi, i'm will
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
