'use client'
import {Affix, Anchor, Grid, Text, Title} from "@mantine/core";
import flower from "../../public/flower.svg"
import HeroCard from "@/components/atoms/HeroCard";
import Image from "next/image";
import dynamic from "next/dynamic";

// TODO: for some reason, even though BlogTable is a ClientComponent,
//  there's a hydration error when we use it normally. My bet is that this is something weird between Mantine and the new
//  next app router - I should look into this again in a few months when things have stablized more between next tina and mantine
const BlogTable = dynamic(() => import("@/components/organisms/BlogTable"), { ssr: false})


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
              <Title c={"wine"}>
                  Writing
              </Title>
              <BlogTable />
          </Grid.Col>
          <Grid.Col span={12}>
              <Text c={"wine"}>
                  Find me at:
              </Text>
              <ul>
                  <li>
                      <Anchor href={"https://github.com/ironman5366"}>github.com/ironman5366</Anchor>
                  </li>
              </ul>
          </Grid.Col>
      </Grid>
      <Affix position={{ bottom: 0, left: 20}}>
          <Image src={"/hero.png"} width={400} height={400} alt={"A stylized sketch of me, used as a hero image."} priority={true} />
      </Affix>
  </div>
}
