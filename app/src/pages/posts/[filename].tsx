import React from "react";
import client from "../../../tina/__generated__/client";
import { GetStaticPropsContext } from "next";
import { useTina } from "tinacms/dist/react";
import { PostQuery } from "../../../tina/__generated__/types";
import { Center, Divider, Group, Paper, Stack, Title } from "@mantine/core";
import FormattedDate from "@/components/atoms/FormattedDate";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import NicelyCentered from "@/components/atoms/NicelyCentered";
import { WINE_MID_COLOR } from "@/theme";
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
          borderRadius: 20,
          border: `2px dotted ${WINE_MID_COLOR}`,
        }}
      >
        <Stack>
          <div
            style={{
              textAlign: "center",
            }}
          >
            <Title
              style={{
                fontSize: "1.5em",
                textAlign: "center",
              }}
            >
              {data.post.title}
            </Title>
            <Text
              style={{
                textAlign: "center",
              }}
            >
              {data.post.blurb}
            </Text>
            <Center>
              <Group>
                <>
                  <b>Created: </b>{" "}
                  <FormattedDate isoString={data.post.created_at} />
                </>
                <>
                  <b>Updated: </b>{" "}
                  <FormattedDate isoString={data.post.updated_at} />
                </>
              </Group>
            </Center>
          </div>

          <Divider />
          <div
            style={{
              fontWeight: 50,
              maxWidth: "calc(100vw - 75px)",
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
