"use client";
import { Affix, Anchor, Grid, Text, Title } from "@mantine/core";
import HeroCard from "@/components/atoms/HeroCard";
import Image from "next/image";
import dynamic from "next/dynamic";
import { WINE_MID_COLOR } from "@/theme";

// TODO: for some reason, even though BlogTable is a ClientComponent,
//  there's a hydration error when we use it normally. My bet is that this is something weird between Mantine and the new
//  next app router - I should look into this again in a few months when things have stablized more between next tina and mantine
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
      <Grid>
        <Grid.Col
          span={{
            xs: 12,
            md: 8,
          }}
        >
          <HeroCard />
        </Grid.Col>
        <Grid.Col span={4}>
          <Title c={"wine"}>Writing</Title>
          <BlogTable />
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
          alt={"A stylized sketch of me, used as a hero image."}
          priority={true}
        />
      </Affix>
    </div>
  );
}
