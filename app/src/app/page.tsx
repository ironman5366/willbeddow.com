"use client";
import { Affix, Anchor, em, Grid, Text, Title } from "@mantine/core";
import HeroCard from "@/components/atoms/HeroCard";
import Image from "next/image";
import dynamic from "next/dynamic";
import { WINE_MID_COLOR } from "@/theme";
import { useMediaQuery } from "@mantine/hooks";

// TODO: for some reason, even though BlogTable is a ClientComponent,
//  there's a hydration error when we use it normally. My bet is that this is something weird between Mantine and the new
//  next app router - I should look into this again in a few months when things have stablized more between next tina and mantine
const BlogTable = dynamic(() => import("@/components/organisms/BlogTable"), {
  ssr: false,
});

export default function Home() {
  const isMobile = useMediaQuery(`(max-width: ${em(800)})`);

  // We only need this style to keep from an SSR flicker
  return (
    <div
      style={{
        color: WINE_MID_COLOR,
      }}
    >
      <Grid>
        <Grid.Col span={8}>
          <HeroCard />
        </Grid.Col>
        <Grid.Col span={4} hidden={isMobile}>
          <Title c={"wine"}>Writing</Title>
          <BlogTable truncateTo={1} />
        </Grid.Col>
        <Grid.Col span={12}>
          <Text c={"wine"}>Find me at:</Text>
          <ul>
            <li>
              <Anchor href={"https://github.com/ironman5366"}>
                github.com/ironman5366
              </Anchor>
            </li>
          </ul>
        </Grid.Col>
      </Grid>
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
