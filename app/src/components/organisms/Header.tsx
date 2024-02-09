"use client";
import React from "react";
import { Group } from "@mantine/core";
import Logo from "@/components/atoms/Logo";
import { WHITE_SMOKE, WINE_MID_COLOR } from "@/theme";
import Link from "next/link";
import { EMAIL } from "@/constants";
import useIsMobile from "@/hoks/useIsMobile";

export default function Header() {
  const isMobile = useIsMobile();
  return (
    <div
      style={{
        height: "74px",
        paddingLeft: "10px",
        paddingRight: "10px",
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

        <Group justify={"space-evenly"} c={"wine"}>
          <Link href={"/writing"}>Writing</Link>
          <Link href={"/projects"}>Projects</Link>
          <Link href={`mailto:${EMAIL}`}>
            {!isMobile && "Contact: "} {EMAIL}
          </Link>
        </Group>
      </Group>
    </div>
  );
}
