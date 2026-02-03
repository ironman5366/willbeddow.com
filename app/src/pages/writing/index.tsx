import { Title } from "@mantine/core";
import NicelyCentered from "@/components/atoms/NicelyCentered";
import BlogList from "@/components/organisms/BlogList";
import Head from "next/head";
import { PRIMARY_COLOR, SECONDARY_COLOR } from "@/theme";

export default function Writing() {
  return (
    <NicelyCentered component={"div"}>
      <Head>
        <title>Writing | Will Beddow</title>
      </Head>
      <Title
        style={{
          fontSize: "1.5em",
          fontWeight: 600,
          color: PRIMARY_COLOR,
          marginBottom: "16px",
          paddingBottom: "12px",
          borderBottom: `1px solid ${SECONDARY_COLOR}`,
        }}
      >
        Writing
      </Title>
      <BlogList />
    </NicelyCentered>
  );
}
