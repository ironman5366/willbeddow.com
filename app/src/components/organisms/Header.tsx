"use client";
import { em } from "@mantine/core";
import { DEEP } from "@/theme";
import { EMAIL } from "@/constants";
import useIsMobile from "@/hooks/useIsMobile";
import { useMediaQuery } from "@mantine/hooks";
import FancyLink from "@/components/atoms/FancyLink";

export default function Header() {
  const isMobile = useIsMobile();
  const isTiny = useMediaQuery(`(max-width: ${em(370)})`);

  let contactText;
  if (isTiny) {
    contactText = "email";
  } else if (isMobile) {
    contactText = EMAIL;
  } else {
    contactText = EMAIL;
  }

  return (
    <header
      style={{
        padding: "12px 16px",
        backgroundColor: "#ffffff",
        borderBottom: `1px solid ${DEEP}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <FancyLink
        href={"/"}
        style={{
          fontWeight: 700,
          fontSize: isMobile ? "1.1em" : "1.25em",
          textDecoration: "none",
        }}
      >
        Will Beddow
      </FancyLink>

      <nav
        style={{
          display: "flex",
          gap: isMobile ? "12px" : "24px",
          fontSize: isMobile ? "0.9em" : "1em",
        }}
      >
        <FancyLink href={"/writing"}>Writing</FancyLink>
        <FancyLink href={`mailto:${EMAIL}`}>{contactText}</FancyLink>
      </nav>
    </header>
  );
}
