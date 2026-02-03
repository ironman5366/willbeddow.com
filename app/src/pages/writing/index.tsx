import { Center, Title } from "@mantine/core";
import NicelyCentered from "@/components/atoms/NicelyCentered";
import BlogList from "@/components/organisms/BlogList";
import Head from "next/head";
import { CHARCOAL } from "@/theme";

export default function Writing() {
  return (
    <NicelyCentered component={"div"}>
      <Head>
        <title>Writing | Will Beddow</title>
      </Head>
      <Center>
        <Title c={CHARCOAL} style={{ fontWeight: 500, marginBottom: "24px" }}>Writing</Title>
      </Center>
      <BlogList />
    </NicelyCentered>
  );
}
