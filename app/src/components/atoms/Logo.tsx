import React from "react";
import LogoImage from "@/../public/logo_512.png";
import Image from "next/image";

interface Props {
  size?: number;
}

export default function Logo({ size }: Props) {
  return (
    <Image
      src={LogoImage}
      alt="A stylized floral 'W' logo"
      width={size || 64}
      height={size || 64}
    />
  );
}
