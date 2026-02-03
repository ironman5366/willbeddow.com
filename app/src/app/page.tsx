"use client";
import { Affix, Center, Grid, Stack, Title } from "@mantine/core";
import HeroCard from "@/components/atoms/HeroCard";
import dynamic from "next/dynamic";
import { TEXT_COLOR, ACCENT_COLOR } from "@/theme";
import NicelyCentered from "@/components/atoms/NicelyCentered";
import useIsMobile from "@/hooks/useIsMobile";
import HeroImage from "@/components/atoms/HeroImage";
import { Suspense } from "react";

const BlogList = dynamic(() => import("@/components/organisms/BlogList"), {
  ssr: false,
});

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
        <Grid.Col
          span={5}
          style={{
            borderLeft: `1px solid ${ACCENT_COLOR}`,
            paddingLeft: "24px",
          }}
        >
          <Title order={2} style={{ marginBottom: "16px", fontWeight: 600 }}>
            Writing
          </Title>
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
    <NicelyCentered component={Stack} style={{}}>
      <HeroCard />
      <div
        style={{
          borderTop: `1px solid ${ACCENT_COLOR}`,
          paddingTop: "16px",
          marginTop: "16px",
        }}
      >
        <Title
          order={2}
          style={{ marginBottom: "16px", fontWeight: 600, textAlign: "center" }}
        >
          Writing
        </Title>
        <BlogList truncateTo={3} />
      </div>
      <Center>
        <HeroImage />
      </Center>
    </NicelyCentered>
  );
}

export default function Home() {
  const isMobile = useIsMobile();

  return (
    <div style={{ color: TEXT_COLOR }}>
      <Suspense>
        {isMobile ? <MobileHomeLayout /> : <GridHomeLayout />}
      </Suspense>
    </div>
  );
}
