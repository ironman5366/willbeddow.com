import React, { ComponentProps } from "react";
import Link from "next/link";
import { DEEP } from "@/theme";

export default function FancyLink({
  style,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link
      style={{
        color: DEEP,
        ...style,
      }}
      {...props}
    />
  );
}
