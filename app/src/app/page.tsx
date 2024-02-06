'use client'
import {Card, Center, Container, Flex, Grid, Text, Title} from "@mantine/core";
import flower from "../../public/flower.svg"
import HeroCard from "@/components/atoms/HeroCard";
import { Chicle } from "next/font/google"


export default function Home() {
  return <div style={{
      backgroundImage: `url(${flower.src})`,
      backgroundRepeat: "repeat",
      minHeight: "100vh",
      minWidth: "100vw",
      backgroundColor: "#fefefa",
      padding: 40
  }}>
      <Grid>
          <Grid.Col span={4}>
              <HeroCard />
          </Grid.Col>
      </Grid>
  </div>
}
