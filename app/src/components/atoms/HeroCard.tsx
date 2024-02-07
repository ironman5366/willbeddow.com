import React from "react";
import {Text, Title} from "@mantine/core";
import {Chicle, Bree_Serif} from "next/font/google";

const chicle = Chicle({subsets: ["latin"], weight: "400"})
const breeSerif = Bree_Serif({subsets: ["latin"], weight: "400"})

export default function HeroCard() {
    return <div>
        <Title className={chicle.className} size={80} style={{
            color: "#753742",
        }}>
            Hi, I&apos;m Will
        </Title>
        <Text className={breeSerif.className} style={{
            color: "#753742",
        }} size={"xl"}>
            I like writing code, being outside, and websites that feel cozy.
        </Text>
    </div>
}
