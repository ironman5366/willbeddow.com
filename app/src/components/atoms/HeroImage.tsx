import React from "react";
import Image from "next/image";

export default function HeroImage() {
  return (
    <Image
      src={"/hero.png"}
      width={400}
      height={400}
      style={{
        maxWidth: "40vw",
      }}
      alt={"A stylized sketch of me, used as a hero image."}
      priority={true}
    />
  );
}
