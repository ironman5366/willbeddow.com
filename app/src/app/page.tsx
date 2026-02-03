"use client";
import { Affix, Center, Divider, Grid, Stack, Title } from "@mantine/core";
import HeroCard from "@/components/atoms/HeroCard";
import dynamic from "next/dynamic";
import { CHARCOAL } from "@/theme";
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
        maxWidth: "1200px",
      }}
    >
      <Grid gutter="xl">
        <Grid.Col span={7}>
          <HeroCard />
        </Grid.Col>
        <Grid.Col span={5}>
          <Title style={{ fontWeight: 500, marginBottom: "16px" }}>Writing</Title>
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
      <Divider color={CHARCOAL} style={{ opacity: 0.3 }} />
      <Title style={{ fontWeight: 500 }}>Writing</Title>
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
      style={{
        color: CHARCOAL,
      }}
    >
      <Suspense>
        {isMobile ? <MobileHomeLayout /> : <GridHomeLayout />}
      </Suspense>
    </div>
  );
}
