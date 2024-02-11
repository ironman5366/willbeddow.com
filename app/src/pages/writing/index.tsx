import { Center, Paper, Title } from "@mantine/core";
import NicelyCentered from "@/components/atoms/NicelyCentered";
import BlogList from "@/components/organisms/BlogList";
import Head from "next/head";

export default function Writing() {
  return (
    <NicelyCentered component={"div"}>
      <Head>
        <title>Writing | Will Beddow</title>
      </Head>
      <Center>
        <Title c={"wine"}>Writing</Title>
      </Center>
      <BlogList />
    </NicelyCentered>
  );
}
