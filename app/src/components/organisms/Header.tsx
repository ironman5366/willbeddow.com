"use client";
import React from "react";
import { em, Group } from "@mantine/core";
import Logo from "@/components/atoms/Logo";
import { WHITE_SMOKE, WINE_MID_COLOR } from "@/theme";
import { EMAIL } from "@/constants";
import useIsMobile from "@/hooks/useIsMobile";
import { useMediaQuery } from "@mantine/hooks";
import FancyLink from "@/components/atoms/FancyLink";

export default function Header() {
  const isMobile = useIsMobile();
  const isTiny = useMediaQuery(`(max-width: ${em(370)})`);
  const sidePadding = isMobile ? "5px" : "10px";

  let contactSection;
  let fontSize;
  if (isTiny) {
    contactSection = "Email";
    fontSize = "0.8em";
  } else {
    if (isMobile) {
      contactSection = EMAIL;
      fontSize = "0.8em";
    } else {
      contactSection = `Contact: ${EMAIL}`;
      fontSize = "1em";
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
        maxWidth: "100vw",
      }}
    >
      <Group justify={"space-between"}>
        <FancyLink href={"/"}>
          <Logo />
        </FancyLink>

        <Group
          justify={"space-evenly"}
          c={"wine"}
          style={{
            fontSize,
          }}
        >
          <FancyLink href={"/writing"}>Writing</FancyLink>

          {
            // Disabled until I build the projects page
            //<FancyLink href={"/projects"}>Projects</FancyLink>
          }
          <FancyLink href={`mailto:${EMAIL}`}>{contactSection}</FancyLink>
        </Group>
      </Group>
    </div>
  );
}
