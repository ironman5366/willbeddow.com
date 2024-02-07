import React from "react";
import {Text, Title} from "@mantine/core";

export default function HeroCard() {
    return <div>
        <Title size={80} c="wine">
            Hi, I&apos;m Will
        </Title>
        <Text c={'wine'} size={"xl"}>
            I like writing code, being outside, and websites that feel cozy.
        </Text>
    </div>
}
