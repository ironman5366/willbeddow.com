import React, { useEffect, useState } from "react";
import { Group, Stack, Table } from "@mantine/core";
import { PostConnectionQuery } from "../../../tina/__generated__/types";
import client from "../../../tina/__generated__/client";
import FormattedDate from "@/components/atoms/FormattedDate";
import { getDocumentPath } from "@/blogUtils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WINE_MID_COLOR } from "@/theme";

interface Props {
  truncateTo?: number;
}

export default function BlogTable({ truncateTo }: Props) {
  const [posts, setPosts] = useState<PostConnectionQuery | undefined>();
  const router = useRouter();

  useEffect(() => {
    client.queries
      .postConnection({
        last: truncateTo,
        sort: "created_at",
      })
      .then((res) => {
        setPosts(res.data);
      });
  });

  return (
    <Table
      c={"wine"}
      style={{
        fontSize: "1.5em",
      }}
      highlightOnHover
      captionSide={"bottom"}
    >
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Title</Table.Th>
          <Table.Th>Date</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {posts &&
          posts.postConnection &&
          posts.postConnection.edges &&
          posts.postConnection.edges.reverse().map((post) => (
            <Table.Tr
              key={post?.node?.id}
              style={{
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => {
                router.push(getDocumentPath(post?.node));
              }}
            >
              <Table.Td>{post?.node?.title}</Table.Td>
              <Table.Td>
                {post?.node?.created_at && (
                  <FormattedDate isoString={post.node.created_at} />
                )}
              </Table.Td>
            </Table.Tr>
          ))}
      </Table.Tbody>
      {truncateTo && (
        <Table.Caption>
          <Link
            href={"/writing"}
            style={{
              fontSize: "0.8em",
              color: WINE_MID_COLOR,
            }}
            color={"wine"}
          >
            All Posts →{" "}
          </Link>
        </Table.Caption>
      )}
    </Table>
  );
}
