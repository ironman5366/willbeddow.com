'use client'
import {Grid} from "@mantine/core";
import flower from "../../public/flower.svg"
import HeroCard from "@/components/atoms/HeroCard";


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
