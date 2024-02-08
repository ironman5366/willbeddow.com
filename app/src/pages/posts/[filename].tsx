import React from "react";
import client from "../../../tina/__generated__/client";
import {GetStaticPropsContext} from "next";
import CozyContainer from "@/components/atoms/CozyContainer";
import {useTina} from "tinacms/dist/react";
import {PostQuery} from "../../../tina/__generated__/types";
import {Center, Divider, Paper, Stack, Title} from "@mantine/core";
import FormattedDate from "@/components/atoms/FormattedDate";
import {TinaMarkdown} from "tinacms/dist/rich-text";

export async function getStaticPaths()  {
    const postsListData = await client.queries.postConnection();
    const edges = postsListData.data.postConnection.edges || [];

    return {
        paths: edges.map((post) => ({
            params: { filename: post?.node?._sys.filename || "" },
        })),
        fallback: false,
    }
}

export async function getStaticProps({ params }: GetStaticPropsContext<{
    filename: string
}>) {

    let variables = { relativePath: `${params?.filename}.md` }

    const res = await client.queries.post(variables)
    const query = res.query
    const data = res.data
    variables = res.variables

    return {
        props: {
            variables: variables,
            data: data,
            query: query,
        },
    }
}

export default function Post(props: {
    query: string,
    variables: any,
    data: PostQuery
}) {
    const { data } = useTina({
        query: props.query,
        variables: props.variables,
        data: props.data,
    })

    return <CozyContainer>
        <Center>
            <Paper style={{
                minWidth: "90vw",
                textAlign: "center",
                borderRadius: 20,
            }}>
                <Stack>
                    <Title>
                        {data.post.title}
                    </Title>
                    <dl>
                        <dt>
                            Created At
                        </dt>
                        <dd>
                            <FormattedDate isoString={data.post.created_at} />
                        </dd>
                        <dt>
                            Updated At
                        </dt>
                        <dd>
                            <FormattedDate isoString={data.post.updated_at} />
                        </dd>
                    </dl>
                    <Divider />
                    <TinaMarkdown content={data.post.body} />
                </Stack>
            </Paper>
        </Center>
    </CozyContainer>
}
