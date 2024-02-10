import React, { ComponentProps } from "react";
import Link from "next/link";
import { WINE_MID_COLOR } from "@/theme";

export default function FancyLink({
  style,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link
      style={{
        color: WINE_MID_COLOR,
        fontWeight: "bold",
        ...style,
      }}
      {...props}
    />
  );
}
