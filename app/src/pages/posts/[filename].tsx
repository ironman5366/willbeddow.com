import React from "react";
import client from "../../../tina/__generated__/client";
import { GetStaticPropsContext } from "next";
import { useTina } from "tinacms/dist/react";
import { PostQuery } from "../../../tina/__generated__/types";
import { Center, Divider, Group, Paper, Stack, Title } from "@mantine/core";
import FormattedDate from "@/components/atoms/FormattedDate";
import { TinaMarkdown } from "tinacms/dist/rich-text";

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
  let variables = { relativePath: `${params?.filename}.md` };

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
    <Center>
      <Paper
        style={{
          padding: 30,
          borderRadius: 20,
          maxWidth: "728px",
        }}
      >
        <Stack>
          <Title>{data.post.title}</Title>
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
          <Divider />
          <div
            style={{
              fontWeight: 50,
            }}
          >
            <TinaMarkdown content={data.post.body} />
          </div>
        </Stack>
      </Paper>
    </Center>
  );
}
