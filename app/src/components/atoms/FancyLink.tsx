import React, { ComponentProps } from "react";
import Link from "next/link";
import { TEXT_COLOR } from "@/theme";

export default function FancyLink({
  style,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link
      style={{
        color: TEXT_COLOR,
        fontWeight: 500,
        textDecoration: "underline",
        ...style,
      }}
      {...props}
    />
  );
}
