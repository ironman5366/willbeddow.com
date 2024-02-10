import React from "react";
import Image from "next/image";

export default function HeroImage() {
  return (
    <Image
      src={"/hero.png"}
      width={414}
      height={337}
      style={{
        maxWidth: "50vw",
        height: "auto",
      }}
      alt={"A stylized sketch of me, used as a hero image."}
      priority={true}
    />
  );
}
