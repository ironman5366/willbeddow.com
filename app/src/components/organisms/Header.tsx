import React from "react";
import { Group, Text } from "@mantine/core";
import Logo from "@/components/atoms/Logo";
import { WHITE_SMOKE, WINE_MID_COLOR } from "@/theme";
import Link from "next/link";
import { EMAIL } from "@/constants";

export default function Header() {
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
          <Link href={`mailto:${EMAIL}`}>{EMAIL}</Link>
        </Group>
      </Group>
    </div>
  );
}
