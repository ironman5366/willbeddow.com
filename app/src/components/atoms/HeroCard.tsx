import React, { ReactNode } from "react";
import { Text, Title } from "@mantine/core";
import { CHARCOAL, CHARCOAL_LIGHT, SOFT_BLUE } from "@/theme";
import { EMAIL } from "@/constants";
import FancyLink from "@/components/atoms/FancyLink";

const SECTIONS: ReactNode[] = [
  "I'm a programmer and occasional blogger. I like writing code, being outside, and websites that feel cozy.",
  <>
    I live in San Francisco and work at{" "}
    <FancyLink href={"https://krea.ai"} style={{ color: SOFT_BLUE, textDecoration: "underline" }}>
      Krea
    </FancyLink>
    .
  </>,
  <>
    You can find my code at{" "}
    <FancyLink href={"https://github.com/ironman5366"} style={{ color: SOFT_BLUE, textDecoration: "underline" }}>
      github.com/ironman5366
    </FancyLink>
    , or email me at{" "}
    <FancyLink href={`mailto:${EMAIL}`} style={{ color: SOFT_BLUE, textDecoration: "underline" }}>
      {EMAIL}
    </FancyLink>
    .
  </>,
];

const HERO_TITLE = "Hi, I'm Will";

export default function HeroCard() {
  return (
    <div
      style={{
        color: CHARCOAL,
      }}
    >
      <Title size="2.5em" style={{ fontWeight: 400, marginBottom: "16px" }}>{HERO_TITLE}</Title>
      {SECTIONS.map((section, i) => (
        <Text
          key={i}
          size={"lg"}
          c={CHARCOAL_LIGHT}
          style={{
            lineHeight: 1.6,
            marginBottom: "12px",
          }}
        >
          {section}
        </Text>
      ))}
    </div>
  );
}
