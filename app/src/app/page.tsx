"use client";
import { Center, Grid, Stack, Title } from "@mantine/core";
import HeroCard from "@/components/atoms/HeroCard";
import dynamic from "next/dynamic";
import { PRIMARY_COLOR, SECONDARY_COLOR, TEXT_COLOR } from "@/theme";
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
        maxWidth: "1000px",
        marginLeft: "auto",
        marginRight: "auto",
        paddingTop: "48px",
      }}
    >
      <Grid gutter="xl">
        <Grid.Col span={7}>
          <HeroCard />
          <div style={{ marginTop: "48px" }}>
            <HeroImage />
          </div>
        </Grid.Col>
        <Grid.Col span={5}>
          <Title
            order={2}
            style={{
              fontSize: "1.2em",
              fontWeight: 600,
              color: PRIMARY_COLOR,
              marginBottom: "16px",
              borderBottom: `1px solid ${SECONDARY_COLOR}`,
              paddingBottom: "8px",
            }}
          >
            Recent Writing
          </Title>
          <BlogList truncateTo={4} />
        </Grid.Col>
      </Grid>
    </div>
  );
}

function MobileHomeLayout() {
  return (
    <NicelyCentered component={Stack} style={{}}>
      <HeroCard />
      <div
        style={{
          marginTop: "32px",
          borderTop: `1px solid ${SECONDARY_COLOR}`,
          paddingTop: "24px",
        }}
      >
        <Title
          order={2}
          style={{
            fontSize: "1.2em",
            fontWeight: 600,
            color: PRIMARY_COLOR,
            marginBottom: "16px",
          }}
        >
          Recent Writing
        </Title>
        <BlogList truncateTo={3} />
      </div>
      <Center style={{ marginTop: "32px" }}>
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
        color: TEXT_COLOR,
      }}
    >
      <Suspense>
        {isMobile ? <MobileHomeLayout /> : <GridHomeLayout />}
      </Suspense>
    </div>
  );
}
