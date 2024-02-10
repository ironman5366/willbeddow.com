"use client";
import { Affix, Grid, Paper, Title } from "@mantine/core";
import HeroCard from "@/components/atoms/HeroCard";
import Image from "next/image";
import dynamic from "next/dynamic";
import { WINE_MID_COLOR } from "@/theme";
import NicelyCentered from "@/components/atoms/NicelyCentered";

// TODO: for some reason, even though BlogTable is a ClientComponent,
//  there's a hydration error when we use it normally. My bet is that this is something weird between Mantine and the new
//  next app router - I should look into this again in a few months when things have stabilized more between
//  next, tina, and mantine
const BlogTable = dynamic(() => import("@/components/organisms/BlogTable"), {
  ssr: false,
});

export default function Home() {
  // We only need this style to keep from an SSR flicker
  return (
    <div
      style={{
        color: WINE_MID_COLOR,
      }}
    >
      <NicelyCentered
        component={"div"}
        style={{
          borderRadius: 20,
        }}
      >
        <HeroCard />
      </NicelyCentered>
      <Affix position={{ bottom: 0, left: 10 }}>
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
      </Affix>
    </div>
  );
}
