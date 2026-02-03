"use client";
import React from "react";
import { em, Group } from "@mantine/core";
import { BACKGROUND_COLOR, SECONDARY_COLOR } from "@/theme";
import { EMAIL } from "@/constants";
import useIsMobile from "@/hooks/useIsMobile";
import { useMediaQuery } from "@mantine/hooks";
import FancyLink from "@/components/atoms/FancyLink";

export default function Header() {
  const isMobile = useIsMobile();
  const isTiny = useMediaQuery(`(max-width: ${em(370)})`);
  const sidePadding = isMobile ? "12px" : "24px";

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
      contactSection = EMAIL;
      fontSize = "0.9em";
    }
  }

  return (
    <header
      style={{
        height: "56px",
        paddingLeft: sidePadding,
        paddingRight: sidePadding,
        display: "flex",
        alignItems: "center",
        backgroundColor: BACKGROUND_COLOR,
        borderBottom: `1px solid ${SECONDARY_COLOR}`,
        maxWidth: "100vw",
      }}
    >
      <Group justify={"space-between"} style={{ width: "100%" }}>
        <FancyLink
          href={"/"}
          style={{
            fontWeight: 600,
            fontSize: "1.1em",
            letterSpacing: "-0.02em",
          }}
        >
          Will Beddow
        </FancyLink>

        <Group
          gap={isMobile ? "sm" : "lg"}
          style={{
            fontSize,
          }}
        >
          <FancyLink href={"/writing"}>Writing</FancyLink>
          <FancyLink href={`mailto:${EMAIL}`}>{contactSection}</FancyLink>
        </Group>
      </Group>
    </header>
  );
}
