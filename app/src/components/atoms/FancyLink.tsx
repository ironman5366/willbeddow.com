import React, { ComponentProps } from "react";
import Link from "next/link";
import { PRIMARY_COLOR } from "@/theme";

export default function FancyLink({
  style,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link
      style={{
        color: PRIMARY_COLOR,
        fontWeight: 500,
        textDecoration: "none",
        ...style,
      }}
      {...props}
    />
  );
}
