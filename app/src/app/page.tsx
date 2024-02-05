'use client'
import {Card, Center, Container, Flex, Grid, Text, Title} from "@mantine/core";
import flower from "../../public/flower.svg"
import HeroCard from "../components/atoms/HeroCard";

export default function Home() {
  return <div style={{
      backgroundImage: `url(${flower.src})`,
      backgroundRepeat: "repeat",
      minHeight: "100vh",
      minWidth: "100vw",
      backgroundColor: "#fefefa"
  }}>
      <Center>
          <Container>
              <Flex
                  align="center"
                  justify="center"
                  style={{ height: '100vh' }} // This makes the Flex container fill the viewport height
              >
                  <Card shadow="sm" p="lg" style={{ width: '300px', textAlign: 'center' }}>
                      <Text>This is a centered card.</Text>
                  </Card>
              </Flex>
          </Container>
      </Center>
  </div>
}
