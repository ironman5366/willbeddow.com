import React from "react";
import client from "../../../tina/__generated__/client";
import { GetStaticPropsContext } from "next";
import { useTina } from "tinacms/dist/react";
import { PostQuery } from "../../../tina/__generated__/types";
import FormattedDate from "@/components/atoms/FormattedDate";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import NicelyCentered from "@/components/atoms/NicelyCentered";
import { DEEP, TEAL } from "@/theme";
import Head from "next/head";
import POST_COMPONENTS from "@/components/organisms/PostComponents";

export async function getStaticPaths() {
  const postsListData = await client.queries.postConnection();
  const edges = postsListData.data.postConnection.edges || [];

  return {
    paths: edges.map((post) => ({
      params: { filename: post?.node?._sys.filename || "" },
    })),
    fallback: false,
  };
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext<{
  filename: string;
}>) {
  let variables = { relativePath: `${params?.filename}.mdx` };

  const res = await client.queries.post(variables);
  const query = res.query;
  const data = res.data;
  variables = res.variables;

  return {
    props: {
      variables: variables,
      data: data,
      query: query,
    },
  };
}

export default function Post(props: {
  query: string;
  variables: any;
  data: PostQuery;
}) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  return (
    <>
      <Head>
        <title>{data.post.title} | Will Beddow</title>
      </Head>
      <NicelyCentered component={"article"}>
        <div
          className="box"
          style={{
            color: DEEP,
          }}
        >
          <header
            style={{
              marginBottom: "24px",
              paddingBottom: "16px",
              borderBottom: `1px solid ${TEAL}`,
            }}
          >
            <h1
              style={{
                fontSize: "1.5em",
                fontWeight: 700,
                margin: "0 0 8px 0",
              }}
            >
              {data.post.title}
            </h1>
            <p
              style={{
                fontSize: "1em",
                margin: "0 0 8px 0",
                fontStyle: "italic",
              }}
            >
              {data.post.blurb}
            </p>
            <p
              style={{
                fontSize: "0.85em",
                margin: 0,
                color: TEAL,
              }}
            >
              <FormattedDate isoString={data.post.created_at} />
              {data.post.updated_at !== data.post.created_at && (
                <> · updated <FormattedDate isoString={data.post.updated_at} /></>
              )}
            </p>
          </header>

          <div
            style={{
              lineHeight: 1.6,
              maxWidth: "100%",
            }}
          >
            <TinaMarkdown
              content={data.post.body}
              components={POST_COMPONENTS}
            />
          </div>
        </div>
      </NicelyCentered>
    </>
  );
}
