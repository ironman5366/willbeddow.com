'use client'
import {Affix, Grid} from "@mantine/core";
import flower from "../../public/flower.svg"
import HeroCard from "@/components/atoms/HeroCard";
import Image from "next/image";


export default function Home() {
  return <div style={{
      backgroundImage: `url(${flower.src})`,
      backgroundRepeat: "repeat",
      backgroundColor: "#fefefa",
      minHeight: "100vh",
      minWidth: "100vw",
      padding: 40,
  }}>
      <Grid>
          <Grid.Col span={12}>
              <HeroCard />
          </Grid.Col>
      </Grid>
      <Affix position={{ bottom: 0, left: 20}}>
          <Image src={"/hero.png"} width={400} height={400} alt={"A stylized sketch of me, used as a hero image."} />
      </Affix>
  </div>
}
