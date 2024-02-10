"use client";
import React from "react";
import { em, Flex, Group } from "@mantine/core";
import Logo from "@/components/atoms/Logo";
import { WHITE_SMOKE, WINE_MID_COLOR } from "@/theme";
import Link from "next/link";
import { EMAIL } from "@/constants";
import useIsMobile from "@/hoks/useIsMobile";
import { useMediaQuery } from "@mantine/hooks";

export default function Header() {
  const isMobile = useIsMobile();
  const isTiny = useMediaQuery(`(max-width: ${em(350)})`);
  const sidePadding = isMobile ? "5px" : "10px";

  let fontSize;
  let contactSection;
  if (isTiny) {
    contactSection = "Email";
    fontSize = "0.75em";
  } else {
    if (isMobile) {
      contactSection = EMAIL;
      fontSize = "0.9em";
    } else {
      contactSection = `Contact: ${EMAIL}`;
      fontSize = "1.1em";
    }
  }

  return (
    <div
      style={{
        height: "74px",
        paddingLeft: sidePadding,
        paddingRight: sidePadding,
        paddingBottom: "5px",
        paddingTop: "5px",
        backgroundColor: WHITE_SMOKE,
        borderBottom: `5px solid ${WINE_MID_COLOR}`,
      }}
    >
      <Group justify={"space-between"}>
        <Link href={"/"}>
          <Logo />
        </Link>

        <Group
          justify={"space-evenly"}
          c={"wine"}
          style={{
            fontSize,
          }}
        >
          <Link href={"/writing"}>Writing</Link>
          <Link href={"/projects"}>Projects</Link>
          <Link href={`mailto:${EMAIL}`}>{contactSection}</Link>
        </Group>
      </Group>
    </div>
  );
}
