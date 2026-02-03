import React from "react";
import client from "../../../tina/__generated__/client";
import { GetStaticPropsContext } from "next";
import { useTina } from "tinacms/dist/react";
import { PostQuery } from "../../../tina/__generated__/types";
import { Center, Divider, Group, Paper, Stack, Title } from "@mantine/core";
import FormattedDate from "@/components/atoms/FormattedDate";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import NicelyCentered from "@/components/atoms/NicelyCentered";
import { CHARCOAL, CHARCOAL_LIGHT, CREAM } from "@/theme";
import { Text } from "@mantine/core";
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
      <NicelyCentered
        component={Paper}
        style={{
          border: `1px solid ${CHARCOAL}`,
          backgroundColor: CREAM,
        }}
      >
        <Stack>
          <div
            style={{
              textAlign: "center",
              color: CHARCOAL,
            }}
          >
            <Title
              style={{
                fontSize: "1.5em",
                textAlign: "center",
                fontWeight: 500,
              }}
            >
              {data.post.title}
            </Title>
            <Text
              style={{
                textAlign: "center",
                color: CHARCOAL_LIGHT,
              }}
            >
              {data.post.blurb}
            </Text>
            <Text size="sm" c={CHARCOAL_LIGHT} style={{ marginTop: "8px" }}>
              <FormattedDate isoString={data.post.created_at} />
            </Text>
          </div>

          <Divider color={CHARCOAL} />
          <div
            style={{
              maxWidth: "calc(100vw - 75px)",
              color: CHARCOAL,
              lineHeight: 1.7,
            }}
          >
            <TinaMarkdown
              content={data.post.body}
              components={POST_COMPONENTS}
            />
          </div>
        </Stack>
      </NicelyCentered>
    </>
  );
}
