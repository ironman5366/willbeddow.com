import React from "react";
import { Text, Title } from "@mantine/core";

export default function HeroCard() {
  return (
    <div>
      <Title size="3em" c="wine">
        Hi, I&apos;m Will
      </Title>
      <Text c={"wine"} size={"xl"}>
        I&apos;m a programmer and occasional blogger based in New York City. I
        like writing code, being outside, and websites that feel cozy.
      </Text>
    </div>
  );
}
