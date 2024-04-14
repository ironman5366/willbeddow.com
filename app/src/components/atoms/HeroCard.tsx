import React, { ReactNode } from "react";
import { Text, Title } from "@mantine/core";
import { BREE_SERIF, WINE_MID_COLOR } from "@/theme";
import { EMAIL } from "@/constants";
import FancyLink from "@/components/atoms/FancyLink";

const SECTIONS: ReactNode[] = [
  "I'm a programmer and occasional blogger. I like writing code, being outside, and websites that feel cozy.",
  <>
    I live in San Francisco and work at{" "}
    <FancyLink href={"https://krea.ai"} className={"underline"}>
      Krea
    </FancyLink>
    .
  </>,
  <>
    You can find my code at{" "}
    <FancyLink href={"https://github.com/ironman5366"} className={"underline"}>
      github.com/ironman5366
    </FancyLink>
    , or email me at{" "}
    <FancyLink className="underline" href={`mailto:${EMAIL}`}>
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
        color: WINE_MID_COLOR,
      }}
    >
      <Title size="3em">{HERO_TITLE}</Title>
      {SECTIONS.map((section, i) => (
        <Text
          key={i}
          size={"xl"}
          style={{
            fontFamily: BREE_SERIF.style.fontFamily,
          }}
        >
          {section}
        </Text>
      ))}
    </div>
  );
}
