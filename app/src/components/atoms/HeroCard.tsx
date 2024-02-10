import React, { ReactElement, ReactNode } from "react";
import { Text, Title } from "@mantine/core";
import { WINE_MID_COLOR } from "@/theme";
import Link from "next/link";
import { EMAIL } from "@/constants";

const SECTIONS: ReactNode[] = [
  "I'm a programmer and occasional blogger based in New York City. I like writing code, being outside, and websites that feel cozy.",
  <>
    You can find my code at{" "}
    <Link href={"https://github.com/ironman5366"} className={"underline"}>
      github.com/ironman5366
    </Link>
    , or email me at{" "}
    <Link className="underline" href={`mailto:${EMAIL}`}>
      {EMAIL}
    </Link>
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
        <>
          <Text key={i} size="xl">
            {section}
          </Text>
          <br />
        </>
      ))}
    </div>
  );
}
