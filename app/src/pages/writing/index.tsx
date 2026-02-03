import { Title } from "@mantine/core";
import NicelyCentered from "@/components/atoms/NicelyCentered";
import BlogList from "@/components/organisms/BlogList";
import Head from "next/head";
import { TEXT_COLOR } from "@/theme";

export default function Writing() {
  return (
    <NicelyCentered component={"div"}>
      <Head>
        <title>Writing | Will Beddow</title>
      </Head>
      <Title
        style={{
          color: TEXT_COLOR,
          fontWeight: 600,
          marginBottom: "24px",
        }}
      >
        Writing
      </Title>
      <BlogList />
    </NicelyCentered>
  );
}
