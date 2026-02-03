import React, { ReactNode } from "react";
import { Stack, Text, Title } from "@mantine/core";
import { PRIMARY_COLOR, TEXT_COLOR } from "@/theme";
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
        size="2.5em"
        style={{
          color: PRIMARY_COLOR,
          marginBottom: "16px",
          fontWeight: 600,
        }}
      >
        {HERO_TITLE}
      </Title>
      <Stack gap="sm">
        {SECTIONS.map((section, i) => (
          <Text
            key={i}
            size="lg"
            style={{
              lineHeight: 1.6,
            }}
          >
            {section}
          </Text>
        ))}
      </Stack>
    </div>
  );
}
