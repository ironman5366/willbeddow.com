import {Card, Center, Text, Title} from "@mantine/core";
import flower from "../../public/flower.svg"

export default function Home() {
  return <div style={{
      backgroundImage: `url(${flower.src})`,
      backgroundRepeat: "repeat",
      minHeight: "100vh",
      minWidth: "100vw",
      backgroundColor: "#fefefa"
  }}>
      <Center>
          <Card shadow={"xl"} style={{
          }}>
              <Title>
                  Hi, I&apos;m Will.
              </Title>
              <Text>
                  I like writing code, being outside, and websites that feel cozy.
              </Text>
          </Card>
      </Center>
  </div>
}
