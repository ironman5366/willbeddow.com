import React, { ComponentProps } from "react";
import Link from "next/link";
import { CHARCOAL } from "@/theme";

export default function FancyLink({
  style,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link
      style={{
        color: CHARCOAL,
        fontWeight: 500,
        textDecoration: "none",
        ...style,
      }}
      {...props}
    />
  );
}
