'use client'
import {Affix, Grid, Text, Title} from "@mantine/core";
import flower from "../../public/flower.svg"
import HeroCard from "@/components/atoms/HeroCard";
import Image from "next/image";
import BlogTable from "@/components/organisms/BlogTable";


export default function Home() {
  return <div style={{
      backgroundImage: `url(${flower.src})`,
      backgroundRepeat: "repeat",
      backgroundColor: "#fefefa",
      minHeight: "100vh",
      minWidth: "100vw",
      padding: 60,
  }}>
      <Grid>
          <Grid.Col span={8}>
              <HeroCard />
          </Grid.Col>
          <Grid.Col span={4}>
              <Title order={3}>
                  My latest posts
              </Title>
              <BlogTable />
          </Grid.Col>
          <Grid.Col span={12}>
              <Text>
                  ABC 123 lorem ipsum
              </Text>
          </Grid.Col>
      </Grid>
      <Affix position={{ bottom: 0, left: 20}}>
          <Image src={"/hero.png"} width={400} height={400} alt={"A stylized sketch of me, used as a hero image."} />
      </Affix>
  </div>
}
