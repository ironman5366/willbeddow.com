"use client";
import { Affix, Stack } from "@mantine/core";
import HeroCard from "@/components/atoms/HeroCard";
import Image from "next/image";
import dynamic from "next/dynamic";
import { WINE_MID_COLOR } from "@/theme";
import useIsMobile from "@/hoks/useIsMobile";

// TODO: for some reason, even though BlogTable is a ClientComponent,
//  there's a hydration error when we use it normally. My bet is that this is something weird between Mantine and the new
//  next app router - I should look into this again in a few months when things have stablized more between next tina and mantine
const BlogTable = dynamic(() => import("@/components/organisms/BlogTable"), {
  ssr: false,
});

export default function Home() {
  const isMobile = useIsMobile();

  // We only need this style to keep from an SSR flicker
  return (
    <div
      style={{
        color: WINE_MID_COLOR,
      }}
    >
      <Stack>
        <HeroCard />
      </Stack>
      <Affix position={{ bottom: 0, left: 20 }}>
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
