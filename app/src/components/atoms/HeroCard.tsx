import React from "react";
import {Text, Title} from "@mantine/core";

export default function HeroCard() {
    return <div>
        <Title size={80} style={{
            color: "#753742",
        }}>
            Hi, I&apos;m Will
        </Title>
        <Text style={{
            color: "#753742",
        }} size={"xl"}>
            I like writing code, being outside, and websites that feel cozy.
        </Text>
    </div>
}
