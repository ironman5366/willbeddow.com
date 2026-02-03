import React from "react";
import Image from "next/image";

export default function HeroImage() {
  return (
    <Image
      src={"/hero.png"}
      width={280}
      height={228}
      style={{
        maxWidth: "min(280px, 80vw)",
        height: "auto",
        opacity: 0.9,
      }}
      alt={"A stylized sketch of me"}
      priority={true}
    />
  );
}
