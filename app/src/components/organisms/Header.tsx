"use client";
import React from "react";
import { em, Group } from "@mantine/core";
import Logo from "@/components/atoms/Logo";
import { BG_COLOR, TEXT_COLOR, ACCENT_COLOR } from "@/theme";
import { EMAIL } from "@/constants";
import useIsMobile from "@/hooks/useIsMobile";
import { useMediaQuery } from "@mantine/hooks";
import FancyLink from "@/components/atoms/FancyLink";

export default function Header() {
  const isMobile = useIsMobile();
  const isTiny = useMediaQuery(`(max-width: ${em(370)})`);
  const sidePadding = isMobile ? "8px" : "16px";

  let contactSection;
  let fontSize;
  if (isTiny) {
    contactSection = "Email";
    fontSize = "0.85em";
  } else {
    if (isMobile) {
      contactSection = EMAIL;
      fontSize = "0.85em";
    } else {
      contactSection = `Contact: ${EMAIL}`;
      fontSize = "0.95em";
    }
  }

  return (
    <header
      style={{
        height: "56px",
        paddingLeft: sidePadding,
        paddingRight: sidePadding,
        paddingBottom: "8px",
        paddingTop: "8px",
        backgroundColor: BG_COLOR,
        borderBottom: `2px solid ${TEXT_COLOR}`,
        maxWidth: "100vw",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Group justify={"space-between"} style={{ width: "100%" }}>
        <FancyLink href={"/"} style={{ textDecoration: "none" }}>
          <Logo />
        </FancyLink>

        <nav>
          <Group
            gap={isMobile ? "sm" : "lg"}
            style={{
              fontSize,
            }}
          >
            <FancyLink href={"/writing"}>Writing</FancyLink>
            <FancyLink href={`mailto:${EMAIL}`}>{contactSection}</FancyLink>
          </Group>
        </nav>
      </Group>
    </header>
  );
}
