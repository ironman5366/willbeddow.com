"use client";
import { Affix, Center, Divider, Grid, Stack, Title } from "@mantine/core";
import HeroCard from "@/components/atoms/HeroCard";
import dynamic from "next/dynamic";
import { WINE_MID_COLOR } from "@/theme";
import NicelyCentered from "@/components/atoms/NicelyCentered";
import useIsMobile from "@/hooks/useIsMobile";
import HeroImage from "@/components/atoms/HeroImage";
import { Suspense } from "react";

// TODO: for some reason, even though BlogTable is a ClientComponent,
//  there's a hydration error when we use it normally. My bet is that this is something weird between Mantine and the new
//  next app router - I should look into this again in a few months when things have stabilized more between
//  next, tina, and mantine
const BlogList = dynamic(() => import("@/components/organisms/BlogList"), {
  ssr: false,
});

/**
 * For desktop, shows the hero image affixed and tries to show recent blog posts next to the main content
 */
function GridHomeLayout() {
  return (
    <div
      style={{
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <Grid>
        <Grid.Col span={7}>
          <HeroCard />
        </Grid.Col>
        <Grid.Col span={5}>
          <Title>Writing</Title>
          <BlogList truncateTo={4} />
        </Grid.Col>
      </Grid>
      <Affix position={{ bottom: 0, left: 10 }}>
        <HeroImage />
      </Affix>
    </div>
  );
}

function MobileHomeLayout() {
  return (
    <NicelyCentered
      component={Stack}
      style={{
        textAlign: "center",
      }}
    >
      <HeroCard />
      <Divider />
      <Title>Writing</Title>
      <BlogList truncateTo={3} />
      <Center>
        <HeroImage />
      </Center>
    </NicelyCentered>
  );
}

export default function Home() {
  const isMobile = useIsMobile();

  return (
    <div
      // We only need this style to keep from an SSR flicker
      style={{
        color: WINE_MID_COLOR,
      }}
    >
      <Suspense>
        {isMobile ? <MobileHomeLayout /> : <GridHomeLayout />}
      </Suspense>
    </div>
  );
}
