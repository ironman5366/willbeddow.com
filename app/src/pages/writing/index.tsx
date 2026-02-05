import NicelyCentered from "@/components/atoms/NicelyCentered";
import BlogList from "@/components/organisms/BlogList";
import Head from "next/head";
import { DEEP } from "@/theme";

export default function Writing() {
  return (
    <NicelyCentered component={"div"}>
      <Head>
        <title>Writing | Will Beddow</title>
      </Head>
      <div
        className="box"
        style={{
          color: DEEP,
        }}
      >
        <h1
          style={{
            fontSize: "1.5em",
            marginBottom: "16px",
            fontWeight: 700,
          }}
        >
          Writing
        </h1>
        <BlogList />
      </div>
    </NicelyCentered>
  );
}
