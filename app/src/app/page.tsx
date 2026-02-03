"use client";
import HeroCard from "@/components/atoms/HeroCard";
import dynamic from "next/dynamic";
import { DEEP } from "@/theme";
import useIsMobile from "@/hooks/useIsMobile";
import { Suspense } from "react";

const BlogList = dynamic(() => import("@/components/organisms/BlogList"), {
  ssr: false,
});

function GridHomeLayout() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "8px",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <HeroCard />
      <div
        className="box"
        style={{
          color: DEEP,
        }}
      >
        <h2
          style={{
            fontSize: "1.25em",
            marginBottom: "12px",
            fontWeight: 700,
          }}
        >
          writing
        </h2>
        <BlogList truncateTo={4} />
      </div>
    </div>
  );
}

function MobileHomeLayout() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <HeroCard />
      <div
        className="box"
        style={{
          color: DEEP,
        }}
      >
        <h2
          style={{
            fontSize: "1.25em",
            marginBottom: "12px",
            fontWeight: 700,
          }}
        >
          writing
        </h2>
        <BlogList truncateTo={3} />
      </div>
    </div>
  );
}

export default function Home() {
  const isMobile = useIsMobile();

  return (
    <div
      style={{
        color: DEEP,
      }}
    >
      <Suspense>
        {isMobile ? <MobileHomeLayout /> : <GridHomeLayout />}
      </Suspense>
    </div>
  );
}
