"use client";
import React from "react";
import { em, Group } from "@mantine/core";
import Logo from "@/components/atoms/Logo";
import { CREAM, CHARCOAL } from "@/theme";
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
    <div
      style={{
        height: "56px",
        paddingLeft: sidePadding,
        paddingRight: sidePadding,
        display: "flex",
        alignItems: "center",
        backgroundColor: CREAM,
        borderBottom: `1px solid ${CHARCOAL}`,
        maxWidth: "100vw",
      }}
    >
      <Group justify={"space-between"} style={{ width: "100%" }}>
        <FancyLink href={"/"}>
          <Logo />
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
    </div>
  );
}
