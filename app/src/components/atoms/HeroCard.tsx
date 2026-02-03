import React, { ReactNode } from "react";
import { Text, Title } from "@mantine/core";
import { TEXT_COLOR } from "@/theme";
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

const HERO_TITLE = "Hi, I'm Will";

export default function HeroCard() {
  return (
    <div
      style={{
        color: TEXT_COLOR,
      }}
    >
      <Title
        style={{
          fontSize: "2.5em",
          marginBottom: "0.5em",
          fontWeight: 600,
        }}
      >
        {HERO_TITLE}
      </Title>
      {SECTIONS.map((section, i) => (
        <Text
          key={i}
          size="lg"
          style={{
            marginBottom: "0.75em",
            lineHeight: 1.6,
          }}
        >
          {section}
        </Text>
      ))}
    </div>
  );
}
