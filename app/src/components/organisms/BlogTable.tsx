import React, { useEffect, useState } from "react";
import { Table } from "@mantine/core";
import { PostConnectionQuery } from "../../../tina/__generated__/types";
import client from "../../../tina/__generated__/client";
import FormattedDate from "@/components/atoms/FormattedDate";
import { getDocumentPath } from "@/blogUtils";
import Link from "next/link";

export default function BlogTable() {
  const [posts, setPosts] = useState<PostConnectionQuery | undefined>();

  useEffect(() => {
    client.queries.postConnection().then((res) => {
      setPosts(res.data);
    });
  });

  return (
    <Table c={"wine"}>
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
          posts.postConnection.edges.map((post) => (
            <Table.Tr
              key={post?.node?.id}
              style={{
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              <Table.Td>
                <Link href={getDocumentPath(post?.node)} key={post?.node?.id}>
                  {post?.node?.title}
                </Link>
              </Table.Td>
              <Table.Td>
                <Link href={getDocumentPath(post?.node)} key={post?.node?.id}>
                  {post?.node?.created_at && (
                    <FormattedDate isoString={post.node.created_at} />
                  )}
                </Link>
              </Table.Td>
            </Table.Tr>
          ))}
      </Table.Tbody>
    </Table>
  );
}
